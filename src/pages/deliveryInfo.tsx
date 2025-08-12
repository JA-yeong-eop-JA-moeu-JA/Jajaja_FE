// src/pages/DeliveryInfo.tsx
import { useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import useOrderDelivery from '@/hooks/order/useOrderDelivery';

import { Button } from '@/components/common/button';
import PageHeader from '@/components/head_bottom/PageHeader';

import BoxIcon from '@/assets/icons/box.svg?react';

function getTrackingUrl(courier: string, invoice: string): string | null {
  if (courier.includes('CJ')) {
    return `https://trace.cjlogistics.com/next/tracking.html?wblNo=${encodeURIComponent(invoice)}`;
  }
  return null;
}

export default function DeliveryInfo() {
  // ✅ 모든 훅은 최상단에서 "항상" 호출
  const navigate = useNavigate();
  const params = useParams<{ orderProductId?: string }>();
  const [sp] = useSearchParams();

  // 파라미터/쿼리 둘 다 지원
  const orderProductIdStr = params.orderProductId ?? sp.get('orderProductId') ?? '';
  const orderProductId = Number(orderProductIdStr);

  // ✅ 훅은 무조건 호출하고, 내부에서 enabled로 네트워크 여부 제어
  const { data, isLoading, isError } = useOrderDelivery(orderProductId);

  // ✅ useMemo도 훅이므로 항상 호출 (data 유무에 안전하게 접근)
  const courier = data?.courier ?? '';
  const invoiceNumber = data?.invoiceNumber ?? '';
  const trackUrl = useMemo(() => (courier && invoiceNumber ? getTrackingUrl(courier, invoiceNumber) : null), [courier, invoiceNumber]);

  // ⬇️ 여기서부터 분기/리턴 (훅 호출 이후)
  if (!Number.isFinite(orderProductId) || orderProductId <= 0) {
    return <p className="p-4 text-error-3">유효하지 않은 주문상품입니다.</p>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <PageHeader title="배송 조회" />
        <p className="p-4 text-black-3">배송 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <PageHeader title="배송 조회" />
        <p className="p-4 text-error-3">배송 정보를 불러오지 못했습니다.</p>
      </div>
    );
  }

  const { delivery } = data;

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
                <span>{invoiceNumber}</span>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(invoiceNumber)}
                  className="text-body-regular leading-5 underline underline-offset-2 text-green hover:text-green-hover"
                >
                  복사하기
                </button>
              </div>
              <span>{courier}</span>
            </div>
          </div>
        </section>

        {/* 배송지 정보 */}
        <section className="bg-white p-4 pt-0 pb-8 border-b border-b-4 border-b-black-1">
          <h2 className="text-subtitle-medium mb-3">배송지 정보</h2>
          <div className="flex">
            <div className="flex flex-col gap-2 text-black-4 text-body-regular w-18">
              <span>받는 분</span>
              <span>연락처</span>
              <span>주소</span>
            </div>
            <div className="flex flex-col gap-2 text-black text-body-regular">
              <span>{delivery.name}</span>
              <span>{delivery.phone}</span>
              <span>{delivery.address}</span>
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
        <Button
          kind="basic"
          variant="outline-orange"
          className="w-full"
          onClick={() => {
            if (trackUrl) {
              window.open(trackUrl, '_blank', 'noopener,noreferrer');
            } else {
              navigate('/home');
            }
          }}
        >
          배송 현황 확인
        </Button>
      </div>
    </div>
  );
}
