import cx from 'clsx';

import type { TCoupons } from '@/types/coupon/TGetCoupons';

interface IProps {
  coupon: TCoupons;
  isSelected?: boolean;
  onClick: () => void;
  disabled?: boolean;
  applicability: 'APPLICABLE' | 'CONDITION_NOT_MET' | 'UNUSABLE';
}

export default function CouponCard({ coupon, isSelected, onClick, disabled = false, applicability }: IProps) {
  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  const formatNumber = (num: number) => new Intl.NumberFormat('ko-KR').format(num);
  const minOrderAmountText = `${formatNumber(coupon.applicableConditions.minOrderAmount)}원 이상`;

  return (
    <div
      onClick={handleClick}
      className={cx('w-full border rounded px-5 py-3 transition flex flex-col gap-2 cursor-pointer', {
        'border-green': isSelected,
        'border-black-1 hover:border-black-3': !isSelected,
        'opacity-50 bg-black-0 cursor-not-allowed': applicability === 'UNUSABLE',
        'cursor-not-allowed': disabled && applicability !== 'UNUSABLE',
      })}
    >
      <p
        className={cx('text-title-medium', {
          'text-orange': applicability === 'APPLICABLE',
          'text-black-4': applicability !== 'APPLICABLE',
        })}
      >
        {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `${formatNumber(coupon.discountValue)}원`}
      </p>
      <p className="text-black text-body-regular">
        {coupon.applicableConditions.values.length > 0 && `[${coupon.applicableConditions.values.join(', ')}] `}
        {coupon.couponName}
      </p>
      <div className="text-black-4 text-body-regular">
        <p className={cx({ 'text-body-medium': applicability === 'CONDITION_NOT_MET' })}>
          {coupon.applicableConditions.type === 'FIRST' ? '첫 구매 시 사용 가능' : `${minOrderAmountText} 구매 시 사용 가능`}
        </p>
        <p>{coupon.applicableConditions.expireAt.slice(0, 10)} 까지</p>
      </div>
    </div>
  );
}
