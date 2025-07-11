import { SelectButton } from '../common/button';

export default function PaymentMethods() {
  return (
    <section className="p-4 border-b border-gray-200 w-full">
      <p className="font-medium mb-2">결제 수단</p>
      <div className="flex w-full gap-2">
        <SelectButton
          kind="select-bottom"
          leftText="카카오페이"
          rightText="네이버페이"
          leftVariant="left-outline"
          rightVariant="right-orange"
          onLeftClick={() => {
            window.location.href = '/return/history';
          }}
          onRightClick={() => {
            window.location.href = '/';
          }}
        />
      </div>
    </section>
  );
}
