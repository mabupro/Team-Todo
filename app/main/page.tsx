// app/main/page.tsx
'use client';

import { useCalendarLogic } from '@/hooks/useCalendarLogic';
import { CalendarPanel } from '@/components/CalendarPanel';

export default function CalendarDemo() {
  const {
    today,
    disabledDays,
    assignmentRange,
    selectedDate,
    setSelectedDate,
    selectedGroup,
    onChangeGroup,
    getNextBusinessDay,
  } = useCalendarLogic();

  return (
    <CalendarPanel
      today={today}
      disabledDays={disabledDays}
      assignmentRange={assignmentRange}
      selectedDate={selectedDate}
      onSelectDate={setSelectedDate}
      selectedGroup={selectedGroup}
      onChangeGroup={onChangeGroup}
      onNextBusinessDay={() => setSelectedDate(getNextBusinessDay())}
    />
  );
}
