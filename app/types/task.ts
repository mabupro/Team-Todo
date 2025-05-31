import type { MemberName } from './member';

/** 朝会／夕会 */
export type Session = 'morning' | 'evening';

export interface Role {
  role: string;
  member: MemberName;
}

export interface Task {
  id: number;
  label: string;
  members: MemberName[];
  session: Session;
  steps?: string[];
  roles?: Role[];
  everyday?: boolean;
}

/** フォーム編集時に使う「id を持たない下書き」 */
export type TaskDraft = Omit<Task, 'id'>;
