'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Role, Task } from '@/app/types/task';
import { circled } from '@/utils/circled';

interface TaskItemProps {
  task: Task;
  done: boolean;
  onToggleDone: () => void;
  onEdit: () => void;
  onRemove: () => void;
  onDragStart: (e: React.DragEvent<HTMLLIElement>, id: number) => void;
}

export function TaskItem({
  task,
  done,
  onToggleDone,
  onEdit,
  onRemove,
  onDragStart,
}: TaskItemProps) {
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

  return (
    <li
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className={`flex flex-col gap-1 px-4 py-3 rounded-md cursor-move ${
        done ? 'bg-muted' : 'hover:bg-accent/40'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox checked={done} onCheckedChange={onToggleDone} />
          <span className={done ? 'line-through text-muted-foreground' : ''}>
            {task.label}
          </span>
          {task.everyday && (
            <Badge variant="secondary" className="ml-1">
              毎日
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground max-w-[120px] truncate">
            {task.members.join(', ')}
          </span>
          <Button size="icon" variant="ghost" onClick={onEdit}>
            <Pencil className="size-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={onRemove}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
      {renderSteps(task.steps)}
      {renderRoles(task.roles)}
    </li>
  );
}
