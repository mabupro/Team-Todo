export const setDoneState = (
  id: number,
  done: boolean,
  setCompleted: React.Dispatch<React.SetStateAction<number[]>>,
) =>
  setCompleted((prev) =>
    done ? [...new Set([...prev, id])] : prev.filter((x) => x !== id),
  );
