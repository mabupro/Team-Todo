import type { GroupId } from './member';

/** react-day-picker の DateRange は from|to が optional のため必須版を用意 */
export interface FixedDateRange {
  from: Date;
  to: Date;
}

/** カレンダーで非活性にしたい日 */
export type DisabledDay = Date | { dayOfWeek: number[] };

/** useCalendarLogic の戻り値に付けると便利 */
export interface CalendarLogic {
  /* state */
  selectedGroup: GroupId;
  onChangeGroup: (g: GroupId) => void;
  selectedDate?: Date;
  setSelectedDate: (d: Date | undefined) => void;

  /* calendar props */
  today: Date;
  disabledDays: DisabledDay[];
  assignmentRange: FixedDateRange;
  getNextBusinessDay: () => Date;

  /* util */
  isBusinessDay: (d: Date) => boolean;
}
