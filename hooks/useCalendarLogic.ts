'use client';

import { useState, useMemo, useCallback } from 'react';
import Holidays from 'date-holidays';
import { isSameDay, startOfDay } from 'date-fns';

import type { GroupId } from '@/app/types'; // ← すべての画面で共通利用する班 ID 型

/* ------------------------------------------------------------------ */
/** react-day-picker が必ず `from`/`to` を持つ形に統一した DateRange */
type FixedDateRange = { from: Date; to: Date };

/** 班ごとの担当期間（例として固定値） */
const GROUP_RANGES: Record<GroupId, FixedDateRange> = {
  A: { from: new Date('2025-04-14'), to: new Date('2025-05-14') },
  B: { from: new Date('2025-05-15'), to: new Date('2025-06-14') },
  C: { from: new Date('2025-06-15'), to: new Date('2025-07-14') },
  D: { from: new Date('2025-07-15'), to: new Date('2025-07-31') },
};
/* ------------------------------------------------------------------ */

export function useCalendarLogic() {
  /* ───────── 今日（00:00 fix） ───────── */
  const today = useMemo(() => startOfDay(new Date()), []);

  /* ───────── 今日が属する班を算出 ───────── */
  const defaultGroup: GroupId = useMemo(() => {
    for (const [g, range] of Object.entries(GROUP_RANGES) as Array<
      [GroupId, FixedDateRange]
    >) {
      if (today >= range.from && today <= range.to) return g;
    }
    return 'A';
  }, [today]);

  /* ───────── React state ───────── */
  const [selectedGroup, setSelectedGroup] = useState<GroupId>(defaultGroup);
  const [selectedDate, setSelectedDate] = useState<Date>();

  /** 班コンボのハンドラ（文字列キャスト不要に） */
  const onChangeGroup = useCallback((g: GroupId) => setSelectedGroup(g), []);

  /* ───────── 祝日 & 会社休日 ───────── */
  const jpHolidays = useMemo(() => {
    const hd = new Holidays('JP');
    return hd.getHolidays(today.getFullYear()).map((h) => startOfDay(h.start));
  }, [today]);

  // TODO: 追加
  const companyHolidays = useMemo(
    () => ['2025-04-28', '2025-04-30'].map((d) => startOfDay(new Date(d))),
    [],
  );

  /* ───────── 営業日判定 ───────── */
  const isBusinessDay = useCallback(
    (d: Date) => {
      const dow = d.getDay();
      if (dow === 0 || dow === 6) return false; // 土日
      if (jpHolidays.some((h) => isSameDay(h, d))) return false; // 祝日
      if (companyHolidays.some((h) => isSameDay(h, d))) return false; // 会社休日
      return true;
    },
    [jpHolidays, companyHolidays],
  );

  const getNextBusinessDay = useCallback((): Date => {
    const d = startOfDay(new Date(today));
    do d.setDate(d.getDate() + 1);
    while (!isBusinessDay(d));
    return d;
  }, [today, isBusinessDay]);

  /* ───────── react-day-picker 用 ───────── */
  const disabledDays = useMemo(
    () => [{ dayOfWeek: [0, 6] }, ...jpHolidays, ...companyHolidays],
    [jpHolidays, companyHolidays],
  );

  const assignmentRange = useMemo(
    () => GROUP_RANGES[selectedGroup],
    [selectedGroup],
  );

  /* ───────── exports ───────── */
  return {
    /* state */
    selectedGroup,
    onChangeGroup,
    selectedDate,
    setSelectedDate,

    /* calendar props */
    today,
    disabledDays,
    assignmentRange,
    getNextBusinessDay,

    /* for external use */
    isBusinessDay,
  };
}
