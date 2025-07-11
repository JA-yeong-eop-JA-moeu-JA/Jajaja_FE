import type { ICoupon } from '@/constants/coupon/coupons';

interface IProps {
  coupon: ICoupon;
  isSelected: boolean;
  onClick: () => void;
}

export default function CouponCard({ coupon, isSelected, onClick }: IProps) {
  return (
    <div
      onClick={onClick}
      className={`w-full border rounded p-4 px-5 py-4 cursor-pointer transition 
      ${isSelected ? 'border-green' : 'border-black-1'}`}
    >
      <p className="text-orange font-title-medium">{coupon.discountText}</p>
      <p className="text-black body-regular mt-1 mb-2">{coupon.title}</p>
      <p className="text-black-4 body-regular">{coupon.minPrice}</p>
      <p className="text-black-4 body-regular">{coupon.expiredAt}</p>
    </div>
  );
}
