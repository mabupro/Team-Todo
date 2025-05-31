'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X, ChevronUp, ChevronDown } from 'lucide-react';

import type { Task, MemberName } from '@/app/types';
import { circled } from '@/utils/circled';

/* ------------------------------------------------------------------ */
interface TaskFormProps {
  draft: Omit<Task, 'id'>;
  activeMembers: MemberName[];
  onChange: (draft: Omit<Task, 'id'>) => void;
  onCancel: () => void;
  onSave: () => void;
  isNew: boolean;
}
/* ------------------------------------------------------------------ */

export function TaskForm({
  draft,
  activeMembers,
  onChange,
  onCancel,
  onSave,
  isNew,
}: TaskFormProps) {
  /* ---- step handlers ------------------------------------------- */
  const handleStepChange = (i: number, v: string) =>
    onChange({
      ...draft,
      steps: draft.steps?.map((s, idx) => (idx === i ? v : s)),
    });

  const addStep = () =>
    onChange({ ...draft, steps: [...(draft.steps ?? []), ''] });

  const removeStep = (i: number) =>
    onChange({
      ...draft,
      steps: draft.steps?.filter((_, idx) => idx !== i),
    });

  const moveStep = (i: number, dir: -1 | 1) => {
    const steps = [...(draft.steps ?? [])];
    const j = i + dir;
    if (j < 0 || j >= steps.length) return;
    [steps[i], steps[j]] = [steps[j], steps[i]];
    onChange({ ...draft, steps });
  };

  /* ---- role handlers ------------------------------------------- */
  const handleRoleName = (i: number, v: string) =>
    onChange({
      ...draft,
      roles: draft.roles?.map((r, idx) => (idx === i ? { ...r, role: v } : r)),
    });

  const handleRoleMember = (i: number, v: MemberName) =>
    onChange({
      ...draft,
      roles: draft.roles?.map((r, idx) =>
        idx === i ? { ...r, member: v } : r,
      ),
    });

  const addRole = () =>
    onChange({
      ...draft,
      roles: [...(draft.roles ?? []), { role: '', member: '' as MemberName }],
    });

  const removeRole = (i: number) =>
    onChange({
      ...draft,
      roles: draft.roles?.filter((_, idx) => idx !== i),
    });

  /* ---- render --------------------------------------------------- */
  return (
    <Card className="mb-6 w-full">
      <CardHeader>
        <CardTitle className="text-lg">
          {isNew ? 'タスクを追加' : 'タスクを編集'}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Input
          placeholder="タスク名"
          value={draft.label}
          onChange={(e) => onChange({ ...draft, label: e.target.value })}
        />

        <label className="flex items-center space-x-2 text-sm">
          <Checkbox
            checked={draft.everyday}
            onCheckedChange={(c) => onChange({ ...draft, everyday: !!c })}
          />
          <span>毎日行うタスク</span>
        </label>

        {/* 手順編集 -------------------------------------------------- */}
        <div className="space-y-2">
          {draft.steps?.map((s, i) => (
            <div key={i} className="flex items-center space-x-2">
              <span className="text-muted-foreground">{circled(i + 1)}</span>
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
              <Button size="icon" variant="ghost" onClick={() => removeStep(i)}>
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

        {/* 役割編集 -------------------------------------------------- */}
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
                onChange={(e) =>
                  handleRoleMember(i, e.target.value as MemberName)
                }
                className="flex-1 rounded-md border px-2 py-1 text-sm"
              >
                <option value="">— 担当者 —</option>
                {activeMembers.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <Button size="icon" variant="ghost" onClick={() => removeRole(i)}>
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

        {/* メンバー選択 --------------------------------------------- */}
        <div className="grid grid-cols-3 gap-2">
          {activeMembers.map((m) => (
            <label key={m} className="flex items-center space-x-2 text-sm">
              <Checkbox
                checked={draft.members.includes(m)}
                onCheckedChange={(c) =>
                  onChange({
                    ...draft,
                    members: c
                      ? [...draft.members, m]
                      : draft.members.filter((x) => x !== m),
                  })
                }
              />
              <span>{m}</span>
            </label>
          ))}
        </div>

        {/* セッション選択 ------------------------------------------- */}
        <div className="flex space-x-4">
          {(['morning', 'evening'] as const).map((s) => (
            <label key={s} className="flex items-center space-x-1 text-sm">
              <input
                type="radio"
                name="session"
                value={s}
                checked={draft.session === s}
                onChange={() => onChange({ ...draft, session: s })}
              />
              <span>{s === 'morning' ? '朝会' : '夕会'}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            キャンセル
          </Button>
          <Button onClick={onSave}>保存</Button>
        </div>
      </CardContent>
    </Card>
  );
}
