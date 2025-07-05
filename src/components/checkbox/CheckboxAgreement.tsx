import { type TCheckboxType, useAgreementCheckboxStore } from '@/stores/agreementCheckboxStore';

import BaseCheckbox from '@/components/common/checkbox';

interface IProps {
  type: TCheckboxType;
  message?: string;
  textClassName?: string;
}

export default function CheckboxAgreement({ type, message, textClassName }: IProps) {
  const { checkedItems, toggle } = useAgreementCheckboxStore();
  const isChecked = checkedItems[type] ?? false;

  return <BaseCheckbox checked={isChecked} onClick={() => toggle(type)} message={message} textClassName={textClassName} />;
}
