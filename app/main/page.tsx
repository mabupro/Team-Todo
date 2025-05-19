'use client';

import { useState } from 'react';
import { useCalendarLogic } from '@/hooks/useCalendarLogic';
import { useWorkLocation } from '@/hooks/useWorkLocation';
import { CalendarPanel } from '@/components/CalendarPanel';
import { Tasklist } from '@/components/Tasklist';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Task } from '@/components/Tasklist';

// 班ごとのメンバー一覧とタスク一覧をmainで一元管理
type Group = 'A' | 'B' | 'C' | 'D';

const MEMBER_LIST: Record<Group, string[]> = {
  A: ['Alice', 'Bob', 'Charlie'],
  B: ['Dave', 'Eve', 'Frank'],
  C: ['Grace', 'Heidi', 'Ivan'],
  D: ['Judy', 'Ken', 'Leo'],
};

const ALL_MEMBERS = Object.values(MEMBER_LIST).flat();

const TASKS: Task[] = [
  { id: 1, label: '朝会準備', members: ALL_MEMBERS, session: 'morning' },
  { id: 2, label: '朝会片付け', members: ALL_MEMBERS, session: 'morning' },
  { id: 3, label: '夕会準備', members: ALL_MEMBERS, session: 'evening' },
  { id: 4, label: '夕会片付け', members: ALL_MEMBERS, session: 'evening' },
];

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

  // mainで管理するメンバー選択
  const [selectedMember, setSelectedMember] = useState<string>('');
  const members = MEMBER_LIST[selectedGroup as Group];

  // 選択日の勤務場所
  const location = useWorkLocation(selectedDate);

  // 班変更時にメンバーをリセット
  const handleChangeGroup = (g: string) => {
    onChangeGroup(g);
    setSelectedMember('');
  };

  // 朝会／夕会タブ制御
  const [session, setSession] = useState<'morning' | 'evening'>('morning');

  return (
    <div className="min-h-screen flex flex-col items-center p-4 space-y-6">
      {/* カレンダーと操作パネル */}
      <Card className="w-full max-w-6xl">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>カレンダーと操作パネル</CardTitle>
        </CardHeader>
        <CardContent>
          <CalendarPanel
            today={today}
            disabledDays={disabledDays}
            assignmentRange={assignmentRange}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            selectedGroup={selectedGroup}
            onChangeGroup={handleChangeGroup}
            onNextBusinessDay={() => setSelectedDate(getNextBusinessDay())}
            members={members}
            selectedMember={selectedMember}
            onChangeMember={setSelectedMember}
          />
        </CardContent>
      </Card>

      {/* 勤務場所表示パネル ★ ここを新設 */}
      <Card className="w-full max-w-6xl">
        <CardHeader>
          <CardTitle>選択日の勤務場所</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDate ? (
            <p className="text-lg">
              {location ?? '未登録（決まり次第入力してください）'}
            </p>
          ) : (
            <p className="text-muted-foreground">日付を選択してください</p>
          )}
        </CardContent>
      </Card>

      {/* セッション切替タブ */}
      <Tabs
        defaultValue={session}
        onValueChange={(v) => setSession(v as 'morning' | 'evening')}
        className="w-full max-w-6xl"
      >
        <TabsList>
          <TabsTrigger value="morning">朝会タスク</TabsTrigger>
          <TabsTrigger value="evening">夕会タスク</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* タスクリスト */}
      <Card className="w-full max-w-6xl">
        <CardHeader>
          <CardTitle>タスクリスト</CardTitle>
        </CardHeader>
        <CardContent>
          {/* session を渡して Tasklist 内で判別 */}
          <Tasklist
            selectedMember={selectedMember}
            tasks={TASKS}
            session={session}
          />
        </CardContent>
      </Card>
    </div>
  );
}
