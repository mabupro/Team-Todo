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
import { Badge } from '@/components/ui/badge';
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
  // 追加 props: メンバーリストと選択
  members: string[];
  selectedMember: string;
  onChangeMember: (m: string) => void;
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
  members,
  selectedMember,
  onChangeMember,
}: CalendarPanelProps) {
  return (
    <div className="flex p-6 gap-5 rounded-xl shadow-md">
      {/* カレンダー */}
      <div className="flex-1">
        <Calendar
          className="h-full"
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
      </div>

      {/* 操作用パネル */}
      <Card className="w-80 h-full flex flex-col">
        <CardHeader>
          <CardTitle>操作パネル</CardTitle>
          {/* 班とメンバー表示 */}
          <div className="flex space-x-2 mt-2">
            <Badge variant="secondary">班 {selectedGroup}</Badge>
            <Badge variant="secondary">{selectedMember || '全員'}</Badge>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            {/* 今日 */}
            <div className="p-4 bg-white rounded-lg shadow-inner">
              <div className="text-xs text-gray-500">今日の日付</div>
              <div className="text-lg font-semibold">
                {today.toLocaleDateString('ja-JP')}
              </div>
            </div>

            {/* 次営業日 */}
            <Button variant="outline" onClick={onNextBusinessDay}>
              次営業日を表示
            </Button>

            {/* 班選択 */}
            <div className="space-y-1">
              <div className="text-xs text-gray-500">班を選択</div>
              <Select value={selectedGroup} onValueChange={onChangeGroup}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="班を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">班 A</SelectItem>
                  <SelectItem value="B">班 B</SelectItem>
                  <SelectItem value="C">班 C</SelectItem>
                  <SelectItem value="D">班 D</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* メンバー選択 */}
            <div className="space-y-1">
              <div className="text-xs text-gray-500">メンバーを選択</div>
              <Select value={selectedMember} onValueChange={onChangeMember}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="メンバーを選択" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
