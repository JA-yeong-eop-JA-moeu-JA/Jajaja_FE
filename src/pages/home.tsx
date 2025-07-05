import { useState } from 'react';

import { useModalStore } from '@/stores/modalStore';

import ExampleAgreementCheckbox from '@/components/checkbox/exampleAgreementCheckbox';
import ExampleProductCheckbox from '@/components/checkbox/exampleProductCheckbox';
import { Button, PageButton, SelectButton, type TabId } from '@/components/common/button';
import BaseCheckbox from '@/components/common/checkbox';
import Header from '@/components/HomeHeader';

import Logo from '@/assets/logo.svg?react';

export default function Home() {
  const [selectedTop1, setSelectedTop1] = useState<TabId>('basic');
  const [selectedTop2, setSelectedTop2] = useState<TabId>('review');
  const { openModal } = useModalStore();
  const [isDefaultAddress, setIsDefaultAddress] = useState(false);

  return (
    <>
      <Header />
      {/* 약관 동의 */}
      <ExampleAgreementCheckbox />

      {/* 상품 선택 */}
      <ExampleProductCheckbox />

      {/* 기본 배송지 설정 */}
      <div className="mt-10">
        <BaseCheckbox
          checked={isDefaultAddress}
          onClick={() => setIsDefaultAddress(!isDefaultAddress)}
          message="기본 배송지로 설정"
          textClassName="text-[15px] leading-5 font-normal text-[#1E1E1E]"
        />
      </div>
      <p className="text-title-medium" onClick={() => openModal('bottom-drawer')}>
        scroll type
      </p>
      <p className="text-title-medium" onClick={() => openModal('bottom-sheet')}>
        close type
      </p>
      <p className="text-title-medium" onClick={() => openModal('alert')}>
        alert type
      </p>
      <Logo />
      <div className="bg-green text-white">Green</div>
      <div className="bg-green-hover">Hover</div>
      <div className="text-error-3">에러 텍스트</div>
      <div className="bg-black-0 text-black-5">검정 계열</div>
      <p className="font-pretendard text-xl">Hello 안녕하세요! Pretendard가 보이시나요?</p>
      <p className="text-title-semibold">오늘은 정말 완벽한 날씨입니다. Today is a perfectly clear day.</p>
      <p className="text-title-medium">오늘은 정말 완벽한 날씨입니다. Today is a perfectly clear day.</p>
      <p className="text-subtitle-semibold">설문조사를 완료하셨나요? Have you completed the survey?</p>
      <p className="text-subtitle-medium">설문조사를 완료하셨나요? Have you completed the survey?</p>
      <p className="text-body-semibold">이 문장은 본문 스타일 테스트를 위한 예시입니다. This sentence is a sample for body text styling.</p>
      <p className="text-body-medium">이 문장은 본문 스타일 테스트를 위한 예시입니다. This sentence is a sample for body text styling.</p>
      <p className="text-body-regular">이 문장은 본문 스타일 테스트를 위한 예시입니다. This sentence is a sample for body text styling.</p>
      <p className="text-small-medium">※ 모든 항목을 정확히 기입해주세요. Please fill out all fields accurately.</p>
      <p className="text-small-regular">※ 모든 항목을 정확히 기입해주세요. Please fill out all fields accurately.</p>
      <p className="text-tiny-medium">ⓘ 저장하지 않으면 변경사항이 사라집니다. Changes will be lost if not saved.</p>
      <div>
        <section>
          <h2 className="text-lg font-semibold">Basic Buttons</h2>
          <Button kind="basic" variant="solid-orange" onClick={() => {}}>
            Solid Orange
          </Button>
          <Button kind="basic" variant="outline-gray" onClick={() => {}}>
            Outline Gray
          </Button>
          <Button kind="basic" variant="solid-gray" onClick={() => {}}>
            Solid Gray
          </Button>
          <Button kind="basic" variant="outline-orange" onClick={() => {}}>
            Outline Orange
          </Button>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Select Bottom Buttons</h2>
          <SelectButton
            kind="select-bottom"
            leftText="Left Outline"
            rightText="Right Orange"
            leftVariant="left-outline"
            rightVariant="right-orange"
            onLeftClick={() => {}}
            onRightClick={() => {}}
          />
          <SelectButton
            kind="select-bottom"
            leftText="Left Solid"
            rightText="Right Orange"
            leftVariant="left-solid"
            rightVariant="right-orange"
            onLeftClick={() => {}}
            onRightClick={() => {}}
          />
        </section>

        <section>
          <h2 className="text-lg font-semibold">Select Content Buttons</h2>
          <SelectButton
            kind="select-content"
            leftText="Disabled"
            rightText="Outline Gray"
            leftVariant="disabled"
            rightVariant="outline-gray"
            onLeftClick={() => {}}
            onRightClick={() => {}}
          />
          <SelectButton
            kind="select-content"
            leftText="Outline Orange"
            rightText="Outline Gray"
            leftVariant="outline-orange"
            rightVariant="outline-gray"
            onLeftClick={() => {}}
            onRightClick={() => {}}
          />
        </section>

        <section>
          <h2 className="text-lg font-semibold">Top Page Buttons</h2>
          <PageButton items={['basic', 'industry']} selected={selectedTop1} onSelect={setSelectedTop1} />
          <PageButton items={['review', 'team']} selected={selectedTop2} onSelect={setSelectedTop2} />
        </section>
      </div>
    </>
  );
}
