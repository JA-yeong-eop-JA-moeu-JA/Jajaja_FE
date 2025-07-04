import Checkbox from '@/components/common/checkbox';

export default function ExampleCheckbox() {
  return (
    <div className="flex flex-col gap-4 mt-10">
      <div className="flex items-center gap-2">
        <Checkbox type="agree-all" />
        <span className="text-body-medium">전체 선택</span>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox type="terms-service" />
        <span className="text-body-medium">서비스 이용 약관 (필수)</span>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox type="terms-privacy" />
        <span className="text-body-medium">개인정보 수집 및 이용 동의 (필수)</span>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox type="terms-age" />
        <span className="text-body-medium">만 14세 이상 확인 (필수)</span>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox type="terms-financial" />
        <span className="text-body-medium">전자금융거래 이용 약관 (필수)</span>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox type="terms-marketing" />
        <span className="text-body-medium">마케팅 정보 수신 동의 (선택)</span>
      </div>
    </div>
  );
}
