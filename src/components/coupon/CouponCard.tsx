import type { TCoupons } from '@/types/coupon/TGetCoupons';

interface IProps {
  coupon: TCoupons;
  isSelected?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export default function CouponCard({ coupon, isSelected, onClick, disabled = false }: IProps) {
  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`w-full border rounded px-5 py-3 transition flex flex-col gap-2 cursor-pointer
        ${isSelected ? 'border-green' : 'border-black-1 hover:border-black-3'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <p className="text-orange text-title-medium">{coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `${coupon.discountValue} 원`}</p>
      <p className="text-black text-body-regular">
        [{coupon.applicableConditions.values.join(', ')}] {coupon.couponName}
      </p>
      <div className="text-black-4 text-body-regular">
        <p>{coupon.applicableConditions.type === 'FIRST' ? '첫 ' : `${coupon.applicableConditions.minOrderAmount} 원 이상`} 구매 시 사용 가능</p>
        <p>{coupon.applicableConditions.expireAt.slice(0, -3)} 까지</p>
      </div>
    </div>
  );
}
