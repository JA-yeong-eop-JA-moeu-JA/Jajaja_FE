import { useModalStore } from '@/stores/modalStore';

// import Logo from '@/assets/logo.svg?react';

export default function Home() {
  const { openModal } = useModalStore();
  return (
    <>
      <p className="text-title-medium" onClick={() => openModal('bottom-drawer')}>
        scroll type
      </p>
      <p className="text-title-medium" onClick={() => openModal('bottom-sheet')}>
        close type
      </p>
      <p className="text-title-medium" onClick={() => openModal('alert')}>
        alert type
      </p>
      {/* <Logo /> */}
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
    </>
  );
}
