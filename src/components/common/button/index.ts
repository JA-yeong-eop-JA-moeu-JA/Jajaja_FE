import type React from 'react';

export type TButtonKind =
  | 'basic' // 1. 기본 버튼
  | 'select-bottom' // 2. 선택 바텀 버튼
  | 'select-content' // 3. 선택 콘텐츠 버튼
  | 'top-page'; // 4. 상단 페이지 버튼

export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  kind: TButtonKind;
  variant?: string;
  active?: boolean;
  className?: string;
}

export { Button } from './button';
export { PageButton, type TTabId as TabId } from './pageButton';
export { SelectButton } from './selectButton';
