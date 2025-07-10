import CheckboxBlank from '@/assets/icons/checkboxBlank.svg?react';
import CheckboxFill from '@/assets/icons/checkboxFill.svg?react';

interface IBaseCheckboxProps {
  checked: boolean;
  onClick: () => void;
  message?: string;
  textClassName?: string;
  disabled?: boolean;
}

export default function BaseCheckbox({ checked, onClick, message, textClassName, disabled = false }: IBaseCheckboxProps) {
  return (
    <label className={`flex items-center gap-4 cursor-pointer font-pretendard ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <input type="checkbox" checked={checked} onChange={onClick} className="hidden" disabled={disabled} />
      <span className="w-5 h-5 flex items-center justify-center shrink-0">
        {checked ? <CheckboxFill className="block" /> : <CheckboxBlank className="block" />}
      </span>
      {message && <span className={textClassName ?? 'text-body-medium'}>{message}</span>}
    </label>
  );
}
