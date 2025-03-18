'use client';

// 1) lucide-react から createLucideIcon をインポート
import { createLucideIcon } from 'lucide-react';

// 2) カスタムアイコンを定義
export const ReactIcon = createLucideIcon('ReactIcon', [
  // ● 中央の白いドット
  [
    'circle',
    {
      cx: '12',
      cy: '12',
      r: '1.5',
      fill: '#fff',
      key: 'center-dot',
    },
  ],
  // ★ React ロゴの楕円1つめ (水平方向)
  [
    'path',
    {
      d: 'M4 12a8 4 0 1 0 16 0 8 4 0 1 0 -16 0',
      stroke: '#fff',
      strokeWidth: '1.5',
      fill: 'none',
      key: 'ellipse1',
    },
  ],
  // ★ React ロゴの楕円2つめ (60°回転)
  [
    'path',
    {
      d: 'M4 12a8 4 0 1 0 16 0 8 4 0 1 0 -16 0',
      stroke: '#fff',
      strokeWidth: '1.5',
      fill: 'none',
      transform: 'rotate(60 12 12)',
      key: 'ellipse2',
    },
  ],
  // ★ React ロゴの楕円3つめ (120°回転)
  [
    'path',
    {
      d: 'M4 12a8 4 0 1 0 16 0 8 4 0 1 0 -16 0',
      stroke: '#fff',
      strokeWidth: '1.5',
      fill: 'none',
      transform: 'rotate(120 12 12)',
      key: 'ellipse3',
    },
  ],
]);
