'use client';

import { useState } from 'react';
import { useCalendarLogic } from '@/hooks/useCalendarLogic';
import { useWorkLocation } from '@/hooks/useWorkLocation';

import { CalendarPanel } from '@/components/CalendarPanel';
import TaskList from '@/components/tasklist/TaskList';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import type { GroupId, MemberName, Session, LocationCode } from '@/app/types';

/* 班→メンバー */
const MEMBER_LIST: Record<GroupId, MemberName[]> = {
  A: ['Alice', 'Bob', 'Charlie'],
  B: ['Dave', 'Eve', 'Frank'],
  C: ['Grace', 'Heidi', 'Ivan'],
  D: ['Judy', 'Ken', 'Leo'],
};

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
    isBusinessDay,
  } = useCalendarLogic();

  /* メンバー選択（undefined = 全員） */
  const [selectedMember, setSelectedMember] = useState<MemberName | undefined>(
    undefined,
  );
  const members = MEMBER_LIST[selectedGroup];

  /* 勤務場所 */
  const location = useWorkLocation(selectedDate); // LocationCode | undefined
  const business = selectedDate ? isBusinessDay(selectedDate) : true;

  /* 班切替でメンバー選択をリセット */
  const handleChangeGroup = (g: GroupId) => {
    onChangeGroup(g);
    setSelectedMember(undefined);
  };

  /* セッション */
  const [session, setSession] = useState<Session>('morning');

  return (
    <div className="min-h-screen flex flex-col items-center p-4 space-y-6">
      {/* カレンダー＋操作パネル */}
      <Card className="w-full max-w-6xl">
        <CardHeader>
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

      {/* 勤務場所パネル */}
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

      {/* セッション切替 */}
      <Tabs
        defaultValue={session}
        onValueChange={(v) => setSession(v as Session)}
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
          <TaskList
            selectedMember={selectedMember}
            session={session}
            location={(location ?? '未登録') as LocationCode}
            isBusinessDay={business}
          />
        </CardContent>
      </Card>
    </div>
  );
}
