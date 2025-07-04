import type { TCheckboxType } from '@/stores/checkboxStore';
import { useCheckboxStore } from '@/stores/checkboxStore';

import CheckboxBlank from '@/assets/icons/checkboxBlank.svg?react';
import CheckboxFill from '@/assets/icons/checkboxFill.svg?react';

interface ICheckboxProps {
  type: TCheckboxType;
}

export default function Checkbox({ type }: ICheckboxProps) {
  const { checkedItems, toggle } = useCheckboxStore();
  const isChecked = checkedItems[type];

  return (
    <button
      onClick={() => toggle(type)}
      className={`
        w-12 h-12 p-1
        flex items-center justify-center
        transition-colors duration-200
      `}
      style={{
        width: '48px',
        height: '48px',
        padding: '4px',
      }}
    >
      {isChecked ? <CheckboxFill /> : <CheckboxBlank />}
    </button>
  );
}
