import CheckboxAgreement from '@/components/checkbox/CheckboxAgreement';

export default function ExampleAgreementCheckbox() {
  const defaultTextClassName = 'text-[15px] leading-5 font-normal text-[#1E1E1E]';

  return (
    <div className="flex flex-col gap-4 mt-10">
      <CheckboxAgreement type="agree-all" message="전체 동의" textClassName="text-[18px] leading-6 font-medium text-[#1E1E1E]" />
      <CheckboxAgreement type="terms-service" message="서비스 이용 약관 (필수)" textClassName={defaultTextClassName} />
      <CheckboxAgreement type="terms-privacy" message="개인정보 수집 및 이용 동의 (필수)" textClassName={defaultTextClassName} />
      <CheckboxAgreement type="terms-age" message="만 14세 이상 확인 (필수)" textClassName={defaultTextClassName} />
      <CheckboxAgreement type="terms-financial" message="전자금융거래 이용 약관 (필수)" textClassName={defaultTextClassName} />
      <CheckboxAgreement type="terms-marketing" message="마케팅 정보 수신 동의 (선택)" textClassName={defaultTextClassName} />
    </div>
  );
}
