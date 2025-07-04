import { useCheckboxStore, type TCheckboxType } from '@/stores/checkboxStore';

interface CheckboxProps {
  type: TCheckboxType;
}

export default function Checkbox({ type }: CheckboxProps): JSX.Element {
  const { checkedItems, toggle } = useCheckboxStore();
  const isChecked = checkedItems[type];

  return (
    <button
      onClick={() => toggle(type)}
      className={`
    w-12 h-12 p-1
    border-2
    flex items-center justify-center
    transition-colors duration-200
    ${isChecked ? 'bg-[#96DB00] border-[#96DB00]' : 'bg-white border-[#96DB00]'}
    rounded-md
  `}
      style={{
        width: '24px',
        height: '24px',
        padding: '1px',
      }}
    >
      {isChecked && (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </button>
  );
}
