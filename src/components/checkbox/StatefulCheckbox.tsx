import BaseCheckbox from '@/components/common/checkbox';

type TUseCheckboxStore<T extends string> = (selector: (state: { checkedItems: Record<T, boolean>; toggle: (id: T) => void }) => any) => any;

interface IProps<T extends string> {
  id: T;
  useStore: TUseCheckboxStore<T>;
  message?: string;
  textClassName?: string;
}

function StatefulCheckbox<T extends string>({ id, useStore, message, textClassName }: IProps<T>) {
  const isChecked = useStore((state) => state.checkedItems[id] ?? false);
  const toggle = useStore((state) => state.toggle);

  return <BaseCheckbox checked={isChecked} onClick={() => toggle(id)} message={message} textClassName={textClassName} />;
}

export default StatefulCheckbox;
