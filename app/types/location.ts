/** 勤務地コードを 1 カ所に集約 */
export const WORK_LOCATION_CODES = [
  '銀座',
  '新宿',
  '在宅',
  '休暇',
  '未登録',
] as const;
export type LocationCode = (typeof WORK_LOCATION_CODES)[number];
