import type { ICoupon } from '@/constants/coupon/coupons';

interface IProps {
  coupon: ICoupon;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function CouponCard({ coupon, isSelected, onClick }: IProps) {
  return (
    <div
      onClick={onClick}
      className={`w-full border rounded px-5 py-3 transition flex flex-col gap-2
      ${isSelected ? 'border-green' : 'border-black-1'}`}
    >
      <p className="text-orange text-title-medium">{coupon.discountText}</p>
      <p className="text-black text-body-regular">{coupon.title}</p>
      <div className="text-black-4 text-body-regular">
        <p>{coupon.minPrice}</p>
        <p>{coupon.expiredAt}</p>
      </div>
    </div>
  );
}
