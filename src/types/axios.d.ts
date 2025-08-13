/* eslint-disable @typescript-eslint/naming-convention */
import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    /** 퍼블릭 요청: 쿠키 보내지 않음, 재발급/모달 제외 */
    skipAuth?: boolean;
    /** 401을 모달 없이 조용히 처리하려는 요청 */
    optionalAuth?: boolean;
    /** 내부 재시도 방지 플래그 */
    _retry?: boolean;
  }
}
/* eslint-enable @typescript-eslint/naming-convention */
