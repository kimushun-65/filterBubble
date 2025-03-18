'use client';

import { createLucideIcon } from 'lucide-react';

export const ReactIcon = createLucideIcon('ReactIcon', [
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
