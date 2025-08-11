// UUID 패키지 대신 crypto API 사용 (브라우저 내장)

/**
 * 고유한 주문번호 생성 (6-64자, 영문 대소문자, 숫자, -, _, = 만 허용)
 */
export const generateOrderId = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8);
  return `order_${timestamp}_${random}`;
};

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
