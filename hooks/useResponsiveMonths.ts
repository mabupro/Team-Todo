// hooks/useResponsiveMonths.ts
'use client';

import { useEffect, useState } from 'react';

/**
 * 画面幅が 640 px（Tailwind の sm ブレークポイント）以上なら 2 ヶ月、
 * それ未満なら 1 ヶ月を返す。
 *
 * SSR → CSR の水位差を避けるため、初期値は 1 にして
 * マウント後に実寸を反映する。
 */
export function useResponsiveMonths() {
  const [months, setMonths] = useState(1);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 800px)');

    const update = () => setMonths(mq.matches ? 2 : 1);
    update(); // 初回実行
    mq.addEventListener('change', update);

    return () => mq.removeEventListener('change', update);
  }, []);

  return months;
}
