import { Button } from './button';

type TSelectKind = 'select-bottom' | 'select-content';

type TLeftVariant<K extends TSelectKind> = K extends 'select-bottom' ? 'left-outline' | 'left-solid' : 'disabled' | 'outline-gray' | 'outline-orange';

type TRightVariant<K extends TSelectKind> = K extends 'select-bottom' ? 'right-orange' : 'disabled' | 'outline-gray' | 'outline-orange';

export interface ISelectButtonProps<K extends TSelectKind> {
  kind: K;
  leftText: string;
  rightText: string;
  leftVariant: TLeftVariant<K>;
  rightVariant: TRightVariant<K>;
  onLeftClick: () => void;
  onRightClick: () => void;
}

export function SelectButton<K extends TSelectKind>(props: ISelectButtonProps<K>) {
  const { kind, leftText, rightText, leftVariant, rightVariant, onLeftClick, onRightClick } = props;

  const marginY = kind === 'select-content' ? 'my-[4px] py-[4px]' : 'my-[8px]';

  return (
    <div className={`flex justify-center gap-[4px] mx-[16px] ${marginY}`}>
      <Button kind={kind} variant={leftVariant} onClick={onLeftClick}>
        {leftText}
      </Button>
      <Button kind={kind} variant={rightVariant} onClick={onRightClick}>
        {rightText}
      </Button>
    </div>
  );
}
