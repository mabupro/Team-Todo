'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

import { Task } from '@/app/types/task';
import { LOCATION_TASK_TEMPLATES } from '@/app/constants/locationTaskTemplates';
import { TaskItem } from './TaskItem';
import { TaskForm } from './TaskForm';
import { setDoneState } from '@/utils/dnd';

interface TaskListProps {
  selectedMember: string;
  session: 'morning' | 'evening';
  location: string;
  isBusinessDay: boolean;
}

export default function TaskList({
  selectedMember,
  session,
  location,
  isBusinessDay,
}: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(
    LOCATION_TASK_TEMPLATES[location] ?? [],
  );
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Omit<Task, 'id'>>({
    label: '',
    members: [],
    session: 'morning',
    steps: [],
    roles: [],
    everyday: false,
  });

  /* --- location change --- */
  useEffect(() => {
    setTasks(LOCATION_TASK_TEMPLATES[location] ?? []);
    setCompletedIds([]);
    setEditId(null);
  }, [location]);

  if (!isBusinessDay || location === '未登録') {
    return (
      <p className="text-center text-muted-foreground">
        本日は非営業日のためタスクリストはありません
      </p>
    );
  }

  const activeMembers = Array.from(
    new Set(tasks.flatMap((t) => t.members)),
  ).sort();

  /* --- CRUD helpers --- */
  const clearDraft = () =>
    setDraft({
      label: '',
      members: [],
      session: 'morning',
      steps: [],
      roles: [],
      everyday: false,
    });

  const startCreate = () => {
    setEditId(-1);
    clearDraft();
  };

  const startEdit = (t: Task) => {
    setEditId(t.id);
    setDraft({
      label: t.label,
      members: t.members,
      session: t.session,
      steps: [...(t.steps ?? [])],
      roles: [...(t.roles ?? [])],
      everyday: !!t.everyday,
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    clearDraft();
  };

  const save = () => {
    if (draft.label.trim() === '') return;
    if (editId === -1) {
      const nextId = Math.max(0, ...tasks.map((t) => t.id)) + 1;
      setTasks((p) => [...p, { ...draft, id: nextId }]);
    } else if (editId !== null) {
      setTasks((p) => p.map((t) => (t.id === editId ? { ...t, ...draft } : t)));
    }
    cancelEdit();
  };

  const remove = (id: number) => setTasks((p) => p.filter((t) => t.id !== id));

  /* --- DnD --- */
  const onDragStart = (e: React.DragEvent<HTMLLIElement>, id: number) =>
    e.dataTransfer.setData('text/plain', String(id));

  const onDragOver = (e: React.DragEvent) => e.preventDefault();

  const onDrop = (e: React.DragEvent, done: boolean) => {
    const id = Number(e.dataTransfer.getData('text/plain'));
    setDoneState(id, done, setCompletedIds);
  };

  /* --- lists --- */
  const list = tasks.filter(
    (t) =>
      t.session === session &&
      (selectedMember === '' || t.members.includes(selectedMember)),
  );
  const incomplete = list.filter((t) => !completedIds.includes(t.id));
  const complete = list.filter((t) => completedIds.includes(t.id));

  return (
    <>
      {editId !== null && (
        <TaskForm
          draft={draft}
          activeMembers={activeMembers}
          onChange={setDraft}
          onCancel={cancelEdit}
          onSave={save}
          isNew={editId === -1}
        />
      )}

      {editId === null && (
        <Button
          onClick={startCreate}
          className="mb-4 flex items-center space-x-1"
        >
          <Plus className="size-4" />
          <span>タスク追加</span>
        </Button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 未完了 */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg">未完了</CardTitle>
            <Badge variant="outline">{incomplete.length}</Badge>
          </CardHeader>
          <Separator />
          <CardContent
            className="p-0"
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, false)}
          >
            <ul className="space-y-1">
              {incomplete.map((t) => (
                <TaskItem
                  key={t.id}
                  task={t}
                  done={false}
                  onToggleDone={() => setDoneState(t.id, true, setCompletedIds)}
                  onEdit={() => startEdit(t)}
                  onRemove={() => remove(t.id)}
                  onDragStart={onDragStart}
                />
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* 完了 */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg">完了</CardTitle>
            <Badge variant="secondary">{complete.length}</Badge>
          </CardHeader>
          <Separator />
          <CardContent
            className="p-0"
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, true)}
          >
            <ul className="space-y-1">
              {complete.map((t) => (
                <TaskItem
                  key={t.id}
                  task={t}
                  done={true}
                  onToggleDone={() =>
                    setDoneState(t.id, false, setCompletedIds)
                  }
                  onEdit={() => startEdit(t)}
                  onRemove={() => remove(t.id)}
                  onDragStart={onDragStart}
                />
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
