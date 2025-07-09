import { useNavigate } from 'react-router-dom';

import { AGREEMENT } from '@/constants/myPage/agreementList';

import CheckboxAgreement from '@/components/checkbox/CheckboxAgreement';
import { Button } from '@/components/common/button';
import PageHeaderBar from '@/components/head_bottom/PageHeader';

import Right from '@/assets/right.svg?react';

export default function Agreement() {
  const navigate = useNavigate();
  return (
    <div className="w-full h-screen flex flex-col justify-between">
      <div>
        <PageHeaderBar />
        <div className="w-full bg-white text-black">
          <p className="text-title-medium text-left pl-4">
            <span className="text-orange">자자자 서비스 이용</span>
            <span>을 위해</span>
            <p>약관에 동의해주세요</p>
          </p>

          <div className="flex flex-col text-body-regular pl-3.5 pt-10 pb-24.25">
            <div className="pb-7">
              <CheckboxAgreement type="agree-all" message="전체 동의" textClassName="text-subtitle-medium py-3" />
            </div>

            {AGREEMENT.map(({ id, type, name, path }) => {
              return (
                <div className="flex items-center justify-between" key={id}>
                  <CheckboxAgreement type={type} message={name} textClassName={'py-3.5'} />
                  <div className="w-12 h-12 flex items-center justify-center">
                    <button onClick={() => navigate(path)}>
                      <Right />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Button kind="basic" variant="solid-orange" onClick={() => navigate('/mypage')}>
        완료
      </Button>
    </div>
  );
}
