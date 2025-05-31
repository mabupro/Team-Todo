'use client';

import { Calendar } from '@/components/ui/calendar';
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
import { Button } from '@/components/ui/button';
import type { DateRange } from 'react-day-picker';

/* ───────── 型 ───────── */
import type { GroupId, MemberName } from '@/app/types';

interface CalendarPanelProps {
  today: Date;
  disabledDays: (Date | { dayOfWeek: number[] })[];
  assignmentRange: DateRange;
  selectedDate?: Date;
  onSelectDate: (d: Date | undefined) => void;

  selectedGroup: GroupId;
  onChangeGroup: (g: GroupId) => void;

  onNextBusinessDay: () => void;

  /* メンバー */
  members: MemberName[];
  selectedMember?: MemberName; // undefined = 全員
  onChangeMember: (m: MemberName | undefined) => void;
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
  /* Select 用の value */
  const memberValue = selectedMember ?? '__ALL__';

  return (
    <div className="flex p-6 gap-5 rounded-xl shadow-md">
      {/* ───────── カレンダー ───────── */}
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

      {/* ───────── 操作用パネル ───────── */}
      <Card className="w-80 h-full flex flex-col">
        <CardHeader>
          <CardTitle>操作パネル</CardTitle>
          <div className="flex space-x-2 mt-2">
            <Badge variant="secondary">班 {selectedGroup}</Badge>
            <Badge variant="secondary">{selectedMember ?? '全員'}</Badge>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            {/* 今日 */}
            <div className="p-4 bg-white rounded-lg shadow-inner">
              <div className="text-xs text-gray-500">今日</div>
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
              <Select
                value={selectedGroup}
                onValueChange={(v) => onChangeGroup(v as GroupId)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="班を選択" />
                </SelectTrigger>
                <SelectContent>
                  {(['A', 'B', 'C', 'D'] as GroupId[]).map((g) => (
                    <SelectItem key={g} value={g}>
                      班 {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* メンバー選択 */}
            <div className="space-y-1">
              <div className="text-xs text-gray-500">メンバーを選択</div>
              <Select
                value={memberValue}
                onValueChange={(v) =>
                  onChangeMember(
                    v === '__ALL__' ? undefined : (v as MemberName),
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="全員" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__ALL__">全員</SelectItem>
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
