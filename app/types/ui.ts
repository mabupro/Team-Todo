/** DnD で完了フラグを切り替える util のシグネチャ例 */
export type DoneStateSetter = (
  id: number,
  done: boolean,
  set: React.Dispatch<React.SetStateAction<number[]>>,
) => void;
