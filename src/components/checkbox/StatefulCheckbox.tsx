import BaseCheckbox from '@/components/common/checkbox';

type TUseCheckboxStore<T extends string> = (selector: (state: { checkedItems: Record<T, boolean>; toggle: (id: T) => void }) => any) => any;

interface IProps<T extends string> {
  id: T;
  useStore: TUseCheckboxStore<T>;
  message?: string;
  textClassName?: string;
}

function StatefulCheckbox<T extends string>({ id, useStore, message, textClassName }: IProps<T>) {
  // 필요한 상태와 함수만 각각 selector로 구독해서 불필요한 리렌더링 방지
  const isChecked = useStore((state) => state.checkedItems[id] ?? false);
  const toggle = useStore((state) => state.toggle);

  return <BaseCheckbox checked={isChecked} onClick={() => toggle(id)} message={message} textClassName={textClassName} />;
}

export default StatefulCheckbox;
