/** 班 ID（固定値） */
export type GroupId = 'A' | 'B' | 'C' | 'D';

/** 将来 ID を持たせる想定のメンバー型 */
export interface Member {
  id: string; // uuid
  name: string;
  group: GroupId;
}

/** 名前だけほしい場面用 */
export type MemberName = Member['name'];
