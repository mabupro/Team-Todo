// app/hooks/useCalendarLogic.ts
import { useState, useMemo, useCallback } from 'react';
import Holidays from 'date-holidays';
import { isSameDay, startOfDay } from 'date-fns';

type Group = 'A' | 'B' | 'C' | 'D';

/** 必須フィールド化した DateRange */
type FixedDateRange = { from: Date; to: Date };

const GROUP_RANGES: Record<Group, FixedDateRange> = {
  A: { from: new Date('2025-04-14'), to: new Date('2025-05-14') },
  B: { from: new Date('2025-05-15'), to: new Date('2025-06-14') },
  C: { from: new Date('2025-06-15'), to: new Date('2025-07-14') },
  D: { from: new Date('2025-07-15'), to: new Date('2025-07-31') },
};

export function useCalendarLogic() {
  /* ───────── 今日 (00:00 固定) ───────── */
  const today = useMemo(() => startOfDay(new Date()), []);

  /* ── 今日を含む班を決定（見つからなければ 'A'）───────── */
  const defaultGroup: Group = useMemo(() => {
    for (const [g, range] of Object.entries(GROUP_RANGES) as [
      Group,
      FixedDateRange,
    ][]) {
      const from = startOfDay(range.from!);
      const to = startOfDay(range.to!);
      if (today >= from && today <= to) return g;
    }
    return 'A';
  }, [today]);

  /* ── state ─────────────────────────── */
  const [selectedGroup, setSelectedGroup] = useState<Group>(defaultGroup);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const onChangeGroup = useCallback(
    (g: string) => setSelectedGroup(g as Group),
    [],
  );

  /* ■ 祝日・会社休日 */
  const jpHolidays = useMemo(() => {
    const hd = new Holidays('JP');
    return hd.getHolidays(today.getFullYear()).map((h) => startOfDay(h.start));
  }, [today]);

  const companyHolidays = useMemo(
    () => ['2025-04-28', '2025-04-30'].map((s) => startOfDay(new Date(s))),
    [],
  );

  /* ■ 営業日判定／次営業日 */
  const isBusinessDay = useCallback(
    (d: Date) => {
      const dow = d.getDay();
      if (dow === 0 || dow === 6) return false;
      if (jpHolidays.some((h) => isSameDay(h, d))) return false;
      if (companyHolidays.some((h) => isSameDay(h, d))) return false;
      return true;
    },
    [jpHolidays, companyHolidays],
  );

  const getNextBusinessDay = useCallback((): Date => {
    const d = new Date(today);
    do d.setDate(d.getDate() + 1);
    while (!isBusinessDay(d));
    return d;
  }, [today, isBusinessDay]);

  /* ■ カレンダー表示用 ─────────────── */
  const disabledDays = useMemo(
    () => [{ dayOfWeek: [0, 6] }, ...jpHolidays, ...companyHolidays],
    [jpHolidays, companyHolidays],
  );

  const assignmentRange = useMemo(
    () => GROUP_RANGES[selectedGroup],
    [selectedGroup],
  );

  return {
    // state
    selectedGroup,
    onChangeGroup,
    selectedDate,
    setSelectedDate,

    // calendar props
    today,
    disabledDays,
    assignmentRange,
    getNextBusinessDay,
  };
}
