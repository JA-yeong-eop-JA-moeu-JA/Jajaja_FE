import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/common/button'; // 버튼 컴포넌트
import PageHeader from '@/components/head_bottom/PageHeader';

import BoxIcon from '@/assets/icons/box.svg?react'; // 택배박스 SVG

export default function DeliveryInfo() {
  const navigate = useNavigate();
  const dummyDeliveryData = {
    invoiceNumber: '236801737204',
    courier: 'CJ대한통운',
    recipient: '이한비',
    phone: '010-2812-1241',
    address: '서울특별시 강서구 낙성서로12번길 3-12',
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header>
        <PageHeader title="배송 조회" />
      </header>

      {/* 본문 영역 - 스크롤 가능 */}
      <main className="flex-1 flex flex-col gap-8 overflow-y-auto">
        {/* 송장 정보 */}
        <section className="bg-white pt-4 px-4 pb-8 border-b border-b-4 border-b-black-1">
          <h2 className="text-subtitle-medium mb-3">송장 정보</h2>
          <div className="flex gap-0">
            <div className="flex flex-col gap-2 text-black-4 text-body-regular w-18">
              <span>송장 번호</span>
              <span>택배사</span>
            </div>
            <div className="flex flex-col gap-2 text-black text-body-regular">
              <div className="flex items-center gap-2">
                <span>{dummyDeliveryData.invoiceNumber}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(dummyDeliveryData.invoiceNumber)}
                  className="text-body-regular leading-5 underline underline-offset-2 text-green hover:text-green-hover "
                >
                  복사하기
                </button>
              </div>
              <span>{dummyDeliveryData.courier}</span>
            </div>
          </div>
        </section>

        {/* 배송지 정보 */}
        <section className="bg-white p-4 pt-0 pb-8 border-b border-b-4 border-b-black-1">
          <h2 className="text-subtitle-medium mb-3">배송지 정보</h2>
          <div className="flex">
            <div className="flex flex-col gap-2 text-black-4 text-body-regular w-18">
              <span>받는 분</span>
              <span>주소</span>
              <span>연락처</span>
            </div>
            <div className="flex flex-col gap-2 text-black text-body-regular">
              <span>{dummyDeliveryData.recipient}</span>
              <span>{dummyDeliveryData.phone}</span>
              <span>{dummyDeliveryData.address}</span>
            </div>
          </div>
        </section>

        {/* 안내 문구 */}
        <section className="flex flex-col items-center text-center text-sm text-body-regular px-4">
          <BoxIcon className="w-[80px] h-[80px] mb-3" />
          <p className="leading-5 text-body-regular text-center">
            아래 버튼을 클릭하면
            <br />
            택배사 사이트로 이동해
            <br />
            배송 현황을 확인할 수 있습니다.
          </p>
        </section>
      </main>

      {/* 하단 버튼 - 고정 */}
      <div className="px-2 pb-0 pt-2 bg-white">
        <Button kind="basic" variant="outline-orange" className="w-full" onClick={() => navigate('/')}>
          배송 현황 확인
        </Button>
      </div>
    </div>
  );
}
