import { SelectButton } from '../common/button';

interface IConfirmModalProps {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ open, message, onConfirm, onCancel }: IConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-[100%] max-w-sm shadow-lg">
        <h2 className="text-lg my-4 text-center">{message}</h2>
        <div className="flex justify-center">
          <div className="w-[50%]">
            <SelectButton
              kind="select-bottom"
              leftText="취소"
              rightText="확인"
              leftVariant="left-outline"
              rightVariant="right-orange"
              onLeftClick={onCancel}
              onRightClick={onConfirm}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
