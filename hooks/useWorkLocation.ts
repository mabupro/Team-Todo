'use client';

import { format } from 'date-fns';
import type { LocationCode } from '@/app/types'; // ← 共通型を参照

/* ------------------------------------------------------------------ */
/** 日付キー → 勤務地 */
const WORK_LOCATIONS: Record<number, LocationCode> = {
  20250519: '銀座',
  20250520: '在宅',
  20250521: '新宿',
  20250522: '休暇',
};
/* ------------------------------------------------------------------ */

/**
 * 任意の日付に対する勤務地を返すカスタム Hook
 * @param date  判定対象の日付（未指定なら undefined）
 * @returns     勤務地 ID ／ 登録が無ければ undefined
 */
export function useWorkLocation(date?: Date): LocationCode | undefined {
  if (!date) return undefined;

  /** `yyyyMMdd` を数値化してキー化 */
  const key = Number(format(date, 'yyyyMMdd')); // e.g. 20250519
  return WORK_LOCATIONS[key];
}
