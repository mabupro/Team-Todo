// app/components/Tasklist.tsx
'use client';

import { useState, useEffect, DragEvent, ChangeEvent } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Plus, X, ChevronUp, ChevronDown } from 'lucide-react';

/* ---------- 型 ---------- */
export interface Role {
  role: string;
  member: string;
}
export interface Task {
  id: number;
  label: string;
  members: string[];
  session: 'morning' | 'evening';
  steps?: string[];
  roles?: Role[];
  everyday?: boolean;
}

interface TasklistProps {
  selectedMember: string; // '' なら全員
  session: 'morning' | 'evening'; // 朝会／夕会
  location: string; // 銀座／新宿／在宅 …
  isBusinessDay: boolean; // 祝日・土日なら false
}

/* ---------- 勤務地ごとの固定タスク雛形 ---------- */
const LOCATION_TASK_TEMPLATES: Record<string, Task[]> = {
  銀座: [
    {
      id: 1,
      label: '受付カウンター開錠',
      members: ['Alice'],
      session: 'morning',
      everyday: true,
    },
    {
      id: 2,
      label: 'プロジェクター準備',
      members: ['Bob'],
      session: 'morning',
      steps: ['スクリーンを下ろす', '電源 ON', '入力を HDMI1 に'],
      everyday: true,
    },
  ],
  新宿: [
    {
      id: 1,
      label: '会議室 A セットアップ',
      members: ['Charlie'],
      session: 'morning',
      everyday: true,
      steps: ['椅子を並べる', 'ホワイトボード清掃'],
    },
  ],
  在宅: [
    {
      id: 1,
      label: 'オンライン朝礼ルーム作成',
      members: ['Dave'],
      session: 'morning',
      everyday: true,
      steps: ['Zoom ルーム作成', 'URL を Slack に投稿'],
    },
  ],
};

/* ========== コンポーネント ========== */
export function Tasklist({
  selectedMember,
  session,
  location,
  isBusinessDay,
}: TasklistProps) {
  /* ---------- state ---------- */
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

  /* ---------- location 変更時は雛形をリロード ---------- */
  useEffect(() => {
    setTasks(LOCATION_TASK_TEMPLATES[location] ?? []);
    setCompletedIds([]);
    setEditId(null);
  }, [location]);

  /* ---------- 営業日でない場合 ---------- */
  if (!isBusinessDay || location == '未登録') {
    return (
      <p className="text-center text-muted-foreground">
        本日は非営業日のためタスクリストはありません
      </p>
    );
  }

  /* ---------- util ---------- */
  const circled = (n: number) => String.fromCharCode(9311 + n); // ①…
  const activeMembers = Array.from(
    new Set(tasks.flatMap((t) => t.members)),
  ).sort();

  /* ---------- CRUD ---------- */
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

  /* ---------- 完了 / DnD ---------- */
  const toggleDone = (id: number) =>
    setCompletedIds((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
    );

  const onDragStart = (e: DragEvent<HTMLLIElement>, id: number) =>
    e.dataTransfer.setData('text/plain', String(id));
  const onDragOver = (e: DragEvent) => e.preventDefault();
  const onDrop = (e: DragEvent, done: boolean) => {
    const id = Number(e.dataTransfer.getData('text/plain'));
    toggleDone(id);
  };

  /* ---------- step handlers ---------- */
  const handleStepChange = (i: number, v: string) =>
    setDraft((p) => {
      const steps = [...(p.steps ?? [])];
      steps[i] = v;
      return { ...p, steps };
    });
  const addStep = () =>
    setDraft((p) => ({ ...p, steps: [...(p.steps ?? []), ''] }));
  const removeStep = (i: number) =>
    setDraft((p) => {
      const steps = [...(p.steps ?? [])];
      steps.splice(i, 1);
      return { ...p, steps };
    });
  const moveStep = (i: number, dir: -1 | 1) =>
    setDraft((p) => {
      const steps = [...(p.steps ?? [])];
      const j = i + dir;
      if (j < 0 || j >= steps.length) return p;
      [steps[i], steps[j]] = [steps[j], steps[i]];
      return { ...p, steps };
    });

  /* ---------- role handlers ---------- */
  const handleRoleName = (i: number, v: string) =>
    setDraft((p) => {
      const roles = [...(p.roles ?? [])];
      roles[i] = { ...roles[i], role: v };
      return { ...p, roles };
    });
  const handleRoleMember = (i: number, v: string) =>
    setDraft((p) => {
      const roles = [...(p.roles ?? [])];
      roles[i] = { ...roles[i], member: v };
      return { ...p, roles };
    });
  const addRole = () =>
    setDraft((p) => ({
      ...p,
      roles: [...(p.roles ?? []), { role: '', member: '' }],
    }));
  const removeRole = (i: number) =>
    setDraft((p) => {
      const roles = [...(p.roles ?? [])];
      roles.splice(i, 1);
      return { ...p, roles };
    });

  /* ---------- render helpers ---------- */
  const renderSteps = (steps?: string[]) =>
    steps?.length ? (
      <ul className="pl-6 mt-2 space-y-1 relative">
        {steps.map((s, i) => (
          <li key={i} className="flex items-start">
            <span className="mr-2 text-muted-foreground">{circled(i + 1)}</span>
            <span>{s}</span>
          </li>
        ))}
        <span className="absolute left-3 top-1 h-full border-l border-muted-foreground/40" />
      </ul>
    ) : null;

  const renderRoles = (roles?: Role[]) =>
    roles?.length ? (
      <ul className="pl-6 mt-2 space-y-0.5">
        {roles.map((r, i) => (
          <li key={i} className="text-xs text-muted-foreground">
            {r.role}：{r.member}
          </li>
        ))}
      </ul>
    ) : null;

  const renderTask = (t: Task, done: boolean) => (
    <li
      key={t.id}
      draggable
      onDragStart={(e) => onDragStart(e, t.id)}
      className={`flex flex-col gap-1 px-4 py-3 rounded-md cursor-move ${
        done ? 'bg-muted' : 'hover:bg-accent/40'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox checked={done} onCheckedChange={() => toggleDone(t.id)} />
          <span className={done ? 'line-through text-muted-foreground' : ''}>
            {t.label}
          </span>
          {t.everyday && (
            <Badge variant="secondary" className="ml-1">
              毎日
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground max-w-[120px] truncate">
            {t.members.join(', ')}
          </span>
          <Button size="icon" variant="ghost" onClick={() => startEdit(t)}>
            <Pencil className="size-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => remove(t.id)}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
      {renderSteps(t.steps)}
      {renderRoles(t.roles)}
    </li>
  );

  /* ---------- フィルタリング ---------- */
  const list = tasks.filter(
    (t) =>
      t.session === session &&
      (selectedMember === '' || t.members.includes(selectedMember)),
  );
  const incomplete = list.filter((t) => !completedIds.includes(t.id));
  const complete = list.filter((t) => completedIds.includes(t.id));

  /* ---------- JSX ---------- */
  return (
    <>
      {/* 編集フォーム */}
      {editId !== null && (
        <Card className="mb-6 w-full">
          <CardHeader>
            <CardTitle className="text-lg">
              {editId === -1 ? 'タスクを追加' : 'タスクを編集'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="タスク名"
              value={draft.label}
              onChange={(e) => setDraft({ ...draft, label: e.target.value })}
            />

            <label className="flex items-center space-x-2 text-sm">
              <Checkbox
                checked={draft.everyday}
                onCheckedChange={(c) =>
                  setDraft((p) => ({ ...p, everyday: !!c }))
                }
              />
              <span>毎日行うタスク</span>
            </label>

            {/* 手順編集 */}
            <div className="space-y-2">
              {draft.steps?.map((s, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <span className="text-muted-foreground">
                    {circled(i + 1)}
                  </span>
                  <Input
                    value={s}
                    onChange={(e) => handleStepChange(i, e.target.value)}
                    className="flex-1"
                  />
                  <div className="flex flex-col">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() => moveStep(i, -1)}
                    >
                      <ChevronUp className="size-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() => moveStep(i, 1)}
                    >
                      <ChevronDown className="size-3" />
                    </Button>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeStep(i)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={addStep}
                className="flex items-center space-x-1"
              >
                <Plus className="size-4" />
                <span>手順を追加</span>
              </Button>
            </div>

            {/* 役割編集 */}
            <div className="space-y-2">
              <p className="text-sm font-medium">役割と担当</p>
              {draft.roles?.map((r, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Input
                    placeholder="役割"
                    value={r.role}
                    onChange={(e) => handleRoleName(i, e.target.value)}
                    className="w-32"
                  />
                  <select
                    value={r.member}
                    onChange={(e) => handleRoleMember(i, e.target.value)}
                    className="flex-1 rounded-md border px-2 py-1 text-sm"
                  >
                    <option value="">— 担当者 —</option>
                    {activeMembers.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeRole(i)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={addRole}
                className="flex items-center space-x-1"
              >
                <Plus className="size-4" />
                <span>役割を追加</span>
              </Button>
            </div>

            {/* メンバー選択 */}
            <div className="grid grid-cols-3 gap-2">
              {activeMembers.map((m) => (
                <label key={m} className="flex items-center space-x-2 text-sm">
                  <Checkbox
                    checked={draft.members.includes(m)}
                    onCheckedChange={(c) =>
                      setDraft((p) => ({
                        ...p,
                        members: c
                          ? [...p.members, m]
                          : p.members.filter((x) => x !== m),
                      }))
                    }
                  />
                  <span>{m}</span>
                </label>
              ))}
            </div>

            {/* セッション選択 */}
            <div className="flex space-x-4">
              {(['morning', 'evening'] as const).map((s) => (
                <label key={s} className="flex items-center space-x-1 text-sm">
                  <input
                    type="radio"
                    name="session"
                    value={s}
                    checked={draft.session === s}
                    onChange={() => setDraft({ ...draft, session: s })}
                  />
                  <span>{s === 'morning' ? '朝会' : '夕会'}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={cancelEdit}>
                キャンセル
              </Button>
              <Button onClick={save}>保存</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 追加ボタン */}
      {editId === null && (
        <Button
          onClick={startCreate}
          className="mb-4 flex items-center space-x-1"
        >
          <Plus className="size-4" />
          <span>タスク追加</span>
        </Button>
      )}

      {/* タスクリスト */}
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
              {incomplete.map((t) => renderTask(t, false))}
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
              {complete.map((t) => renderTask(t, true))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
