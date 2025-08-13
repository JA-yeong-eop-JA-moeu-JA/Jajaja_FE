export interface IDaumPostcodeData {
  /** 우편번호 (5자리) */
  zonecode: string;
  /** 도로명 주소 */
  roadAddress: string;
  /** 지번 주소 */
  jibunAddress: string;
  /** 주소 타입 (R: 도로명, J: 지번) */
  addressType: 'R' | 'J';
  /** 시/도 */
  sido: string;
  /** 시/군/구 */
  sigungu: string;
  /** 법정동/법정리 이름 */
  bname: string;
  /** 건물명 */
  buildingName: string;
}

export type TDaumPostcodeCloseState = 'FORCE_CLOSE' | 'COMPLETE_CLOSE';

declare global {
  interface IWindow {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: IDaumPostcodeData) => void;
        onclose?: (state: TDaumPostcodeCloseState) => void;
        width?: string | number;
        height?: string | number;
      }) => {
        open: () => void;
        embed: (element: HTMLElement) => void;
      };
    };
  }
}

export {};
