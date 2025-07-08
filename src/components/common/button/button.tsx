import type { JSX } from 'react';
import classNames from 'classnames';

import type { IButtonProps } from './index';

const sizeMap: Record<IButtonProps['kind'], string> = {
  'basic': 'w-full h-12',
  'select-bottom': 'w-full h-12',
  'select-content': 'w-full h-10',
  'top-page': 'w-full h-12',
};

const baseMap: Record<IButtonProps['kind'], string> = {
  'basic': 'rounded',
  'select-bottom': 'rounded flex items-center justify-center',
  'select-content': 'rounded flex items-center justify-center',
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

  if (kind === 'basic') {
    return (
      <div className="px-4 py-2">
        <button type="button" className={classes} {...rest}>
          {children}
        </button>
      </div>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
