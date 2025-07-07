import type { JSX } from 'react';
import classNames from 'classnames';

import type { IButtonProps } from './index';

const sizeMap: Record<IButtonProps['kind'], string> = {
  'basic': 'w-[328px] h-[48px]',
  'select-bottom': 'w-[160px] h-[48px]',
  'select-content': 'w-[160px] h-[40px]',
  'top-page': 'w-[180px] h-[48px]',
};

const baseMap: Record<IButtonProps['kind'], string> = {
  'basic': 'mx-[8px] my-[8px] rounded-[4px] overflow-hidden',
  'select-bottom': 'rounded-[4px] flex items-center justify-center overflow-hidden',
  'select-content': 'rounded-[4px] flex items-center justify-center overflow-hidden',
  'top-page': 'flex-1 flex items-center justify-center cursor-pointer',
};

const fontMap: Record<IButtonProps['kind'], string> = {
  'basic': 'text-body-regular',
  'select-bottom': 'text-body-medium',
  'select-content': 'text-body-medium',
  'top-page': 'text-body-medium',
};

const variantMap: Record<IButtonProps['kind'], Record<string, string>> = {
  'basic': {
    'solid-orange': 'bg-orange text-white hover:bg-orange-hover active:bg-orange-active disabled:bg-black-1 disabled:text-black-4',
    'outline-gray': 'bg-white border border-black-3 text-black hover:border-black-4',
    'solid-gray': 'bg-black-1 text-black hover:bg-black-2',
    'outline-orange': 'bg-white border border-orange text-black hover:border-orange-hover',
  },
  'select-bottom': {
    'left-outline': 'border border-black-3 text-black hover:border-black-4',
    'left-solid': 'bg-black text-white hover:bg-black-5',
    'right-orange': 'bg-orange text-white hover:bg-orange-hover',
  },
  'select-content': {
    'disabled': 'border border-black-1 text-black-2 cursor-not-allowed',
    'outline-gray': 'border border-black-3 text-black hover:border-black-4',
    'outline-orange': 'border border-orange text-black hover:border-orange-hover',
  },
  'top-page': {
    default: 'border-b-2 border-black-2 text-black-4 hover:bg-black-0',
    active: 'border-b-2 border-green text-black hover:bg-black-0',
  },
};

export function Button({ kind, variant = 'default', active = false, className, children, ...rest }: IButtonProps): JSX.Element {
  const key = kind === 'top-page' ? (active ? 'active' : 'default') : variant;

  const classes = classNames(sizeMap[kind], baseMap[kind], fontMap[kind], variantMap[kind][key] ?? '', className);

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
