'use client';

import { useState, DragEvent } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// タスク型定義をエクスポート
export interface Task {
  id: number;
  label: string;
  members: string[];
  session: 'morning' | 'evening';
}

interface TasklistProps {
  selectedMember: string; // '' で全員
  tasks: Task[]; // mainから受け取るタスク配列
  session: 'morning' | 'evening'; // 表示するセッション
}

export function Tasklist({ selectedMember, tasks, session }: TasklistProps) {
  const [completedIds, setCompletedIds] = useState<number[]>([]);

  // 完了状態を切り替え
  const toggle = (id: number) => {
    setCompletedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  // ドラッグ開始
  const onDragStart = (e: DragEvent<HTMLLIElement>, id: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(id));
  };

  // ドラッグオーバー許可
  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // ドロップ時に完了/未完了切り替え
  const onDrop = (e: DragEvent<HTMLDivElement>, markComplete: boolean) => {
    e.preventDefault();
    const id = Number(e.dataTransfer.getData('text/plain'));
    setCompletedIds((prev) => {
      const has = prev.includes(id);
      if (markComplete && !has) return [...prev, id];
      if (!markComplete && has) return prev.filter((x) => x !== id);
      return prev;
    });
  };

  // セッションとメンバーでタスクをフィルタ
  const tasksToShow = tasks.filter(
    (task) =>
      task.session === session &&
      (selectedMember === '' || task.members.includes(selectedMember)),
  );

  const incomplete = tasksToShow.filter(
    (task) => !completedIds.includes(task.id),
  );
  const complete = tasksToShow.filter((task) => completedIds.includes(task.id));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 未完了 */}
      <Card className="rounded-2xl shadow bg-white">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">未完了</CardTitle>
          <Badge variant="outline">{incomplete.length}</Badge>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <div
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, false)}
            className="min-h-[100px]"
          >
            <ul>
              {incomplete.map((item) => (
                <li
                  key={item.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, item.id)}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 cursor-move"
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={false}
                      onCheckedChange={() => toggle(item.id)}
                    />
                    <span className="text-base">{item.label}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {item.members.join(', ')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* 完了 */}
      <Card className="rounded-2xl shadow bg-white">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">完了</CardTitle>
          <Badge variant="secondary">{complete.length}</Badge>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <div
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, true)}
            className="min-h-[100px]"
          >
            <ul>
              {complete.map((item) => (
                <li
                  key={item.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, item.id)}
                  className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-move"
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={true}
                      onCheckedChange={() => toggle(item.id)}
                    />
                    <span className="line-through text-base text-gray-500">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {item.members.join(', ')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
