import { Task } from '@/app/types/task';

export const LOCATION_TASK_TEMPLATES: Record<string, Task[]> = {
  銀座: [
    {
      id: 1,
      label: '受付カウンター開錠',
      members: ['Alice'],
      session: 'morning',
      everyday: true,
    },
    {
      id: 2,
      label: 'プロジェクター準備',
      members: ['Bob'],
      session: 'morning',
      steps: ['スクリーンを下ろす', '電源 ON', '入力を HDMI1 に'],
      everyday: true,
    },
  ],
  新宿: [
    {
      id: 1,
      label: '会議室 A セットアップ',
      members: ['Charlie'],
      session: 'morning',
      everyday: true,
      steps: ['椅子を並べる', 'ホワイトボード清掃'],
    },
  ],
  在宅: [
    {
      id: 1,
      label: 'オンライン朝礼ルーム作成',
      members: ['Dave'],
      session: 'morning',
      everyday: true,
      steps: ['Zoom ルーム作成', 'URL を Slack に投稿'],
    },
  ],
};
