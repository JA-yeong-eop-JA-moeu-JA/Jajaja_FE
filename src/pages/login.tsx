import Header from '@/components/head_bottom/HomeHeader';

import Google from '@/assets/myPage/google.svg?react';
import Kakao from '@/assets/myPage/kakao.svg?react';
import Logo from '@/assets/sizeLogo.svg?react';
import SubLogo from '@/assets/subLogo.svg?react';

export default function Login() {
  const handleKakaoLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/kakao`;
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`;
  };

  return (
    <div className="w-full h-screen flex flex-col justify-between">
      <header className="px-2">
        <Header showLogo={false} />
      </header>

      <div className="w-full bg-white text-black pt-15 pb-27 flex flex-col items-center justify-center gap-17.75">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-40 h-9">
            <Logo />
          </div>
          <div className="w-31.5 h-5">
            <SubLogo />
          </div>
        </div>

        <div className="w-full flex flex-col items-center justify-center gap-4 px-4">
          <button className="w-full h-12 rounded bg-[#FDDC3F] flex items-center justify-center relative" onClick={handleKakaoLogin}>
            <span className="absolute left-6 flex items-center">
              <Kakao className="w-6.5 h-6" />
            </span>
            <p className="text-black text-body-medium mx-auto">카카오로 시작하기</p>
          </button>
          <button className="w-full h-12 rounded border border-black-2 flex items-center justify-center relative" onClick={handleGoogleLogin}>
            <span className="absolute left-6 flex items-center">
              <Google className="w-6.5 h-6.5" />
            </span>
            <p className="text-black text-body-medium mx-auto">Google로 시작하기</p>
          </button>
        </div>
      </div>

      <footer className="px-4 pt-5 pb-6 bg-black-0 flex flex-col gap-4">
        <div className="flex items-center px-1 gap-2 text-small-regular">
          <p className="text-black-4">이용약관</p>
          <p>|</p>
          <p>개인정보처리방침</p>
        </div>
        <div className="flex flex-col gap-3 text-tiny-regular text-black-4">
          <p>
            (주) 자자자는 통신판매중개자이며 통신판매의 당사자가 아닙니다. 따라서 (주)자자자는 입점 판매사가 등록한 상품 정보 및 거래에 대해 책임을 지지
            않습니다.
          </p>
          <p>
            본 사이트의 상품/판매자/쇼핑 정보, 콘텐츠, UI 등에 대한 무단 복제, 전송, 배포, 스크래핑 등의 행위는 저작권법, 콘텐츠사업 진흥법 등에 의하여 엄격히
            금지됩니다.
          </p>
          <p>Copyright ⓒ JAJAJA.COM Corp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
