// app/components/CalendarPanel.tsx
'use client';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { DateRange } from 'react-day-picker';

interface CalendarPanelProps {
  today: Date;
  disabledDays: (Date | { dayOfWeek: number[] })[];
  assignmentRange: DateRange;
  selectedDate?: Date;
  onSelectDate: (d: Date | undefined) => void;
  selectedGroup: string;
  onChangeGroup: (g: string) => void;
  onNextBusinessDay: () => void;
}

export function CalendarPanel({
  today,
  disabledDays,
  assignmentRange,
  selectedDate,
  onSelectDate,
  selectedGroup,
  onChangeGroup,
  onNextBusinessDay,
}: CalendarPanelProps) {
  return (
    <div className="flex p-4 h-[350px] items-stretch">
      {/* カレンダー */}
      <Calendar
        className="flex-1 h-full"
        mode="single"
        selected={selectedDate}
        onSelect={onSelectDate}
        disabled={disabledDays}
        modifiers={{ assignment: assignmentRange, today }}
        modifiersClassNames={{
          assignment: 'bg-blue-100 text-blue-800',
          today:
            'bg-yellow-500 text-white font-bold rounded-full ring-2 ring-yellow-700',
        }}
        classNames={{
          day_disabled:
            'bg-transparent text-muted-foreground opacity-50 pointer-events-none',
          day_selected: 'bg-red-200 text-red-800',
        }}
        defaultMonth={today}
      />

      {/* 操作用パネル */}
      <Card className="w-64 h-full">
        <CardHeader>
          <CardTitle>操作パネル</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 今日 */}
          <div>
            <div className="text-sm text-gray-600">今日の日付</div>
            <div className="text-lg font-semibold">
              {today.toLocaleDateString('ja-JP')}
            </div>
          </div>
          <Separator />

          {/* 次営業日 */}
          <Button onClick={onNextBusinessDay} className="w-full">
            次営業日を表示
          </Button>
          <Separator />

          {/* 班選択 */}
          <div>
            <div className="text-sm text-gray-600 mb-1">班を選択</div>
            <Select value={selectedGroup} onValueChange={onChangeGroup}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">班 A</SelectItem>
                <SelectItem value="B">班 B</SelectItem>
                <SelectItem value="C">班 C</SelectItem>
                <SelectItem value="D">班 D</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
