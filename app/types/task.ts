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
