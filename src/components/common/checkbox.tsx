import CheckboxBlank from '@/assets/icons/checkboxBlank.svg?react';
import CheckboxFill from '@/assets/icons/checkboxFill.svg?react';

interface IBaseCheckboxProps {
  checked: boolean;
  onClick: () => void;
  message?: string;
  textClassName?: string;
}

export default function BaseCheckbox({ checked, onClick, message, textClassName }: IBaseCheckboxProps) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={onClick}>{checked ? <CheckboxFill /> : <CheckboxBlank />}</button>
      {message && <span className={textClassName ?? 'text-body-medium'}>{message}</span>}
    </div>
  );
}
