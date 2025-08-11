/**
 * 고유한 고객키 생성 (crypto API 기반)
 */
export const generateCustomerKey = (userId?: string): string => {
  const randomId = crypto.randomUUID().substring(0, 8);
  if (userId) {
    // 로그인한 사용자의 경우 사용자 ID 기반으로 생성
    return `customer_${userId}_${randomId}`;
  }
  // 비로그인 사용자의 경우 UUID로 생성
  return `guest_${randomId}`;
};

/**
 * 결제 금액 계산
 */
export const calculateFinalAmount = (originalAmount: number, discount: number = 0, pointsUsed: number = 0, shippingFee: number = 0): number => {
  const finalAmount = originalAmount - discount - pointsUsed + shippingFee;
  return Math.max(0, finalAmount); // 음수가 되지 않도록
};

/**
 * 휴대폰 번호 포맷팅 (하이픈 제거)
 */
export const formatPhoneNumber = (phone: string): string => {
  return phone.replace(/-/g, '');
};
