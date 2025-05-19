// hooks/useWorkLocation.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { startOfDay } from 'date-fns';

type Location = '銀座' | '新宿' | '在宅' | '休暇';

const WORK_LOCATIONS: Record<number, Location> = {
  // key は yyyyMMdd を数値にしたもの
  20250519: '銀座',
  20250520: '在宅',
  20250521: '新宿',
  20250522: '休暇',
};

export function useWorkLocation(date?: Date): Location | undefined {
  if (!date) return;
  const key = Number(
    date
      .toISOString() // "2025-05-19T00:00:00.000Z"
      .slice(0, 10) // "2025-05-19"
      .replace(/-/g, ''), // "20250519"
  );
  return WORK_LOCATIONS[key];
}
