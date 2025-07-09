import { useLayoutEffect } from 'react';

import { useModalStore } from '@/stores/modalStore';

import SearchInput from '@/components/common/SearchInput';
import BottomBar from '@/components/head_bottom/BottomBar';
import Header from '@/components/head_bottom/HomeHeader';
import Banner from '@/components/home/banner';
import New from '@/components/home/new';
import Popular from '@/components/home/popular';
import Recommand from '@/components/home/recommand';

export default function Home() {
  const { openModal } = useModalStore();
  useLayoutEffect(() => {
    const shouldShow = !document.cookie.includes('hidePopup=true');
    if (shouldShow) {
      openModal('bottom-sheet');
    }
  }, [openModal]);
  return (
    <>
      <header className="w-full px-4 pb-2.5">
        <Header showSearch={false} />
        <SearchInput value={''} onChange={() => {}} />
      </header>

      <section className="w-full">
        <Banner />
      </section>

      <section className="w-full px-4 py-7 flex flex-col items-center gap-8">
        <Recommand />
        <Popular />
        <New />
      </section>
      <footer className="px-4 py-5 bg-black-0 flex flex-col gap-4">
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
      <BottomBar />
    </>
  );
}
