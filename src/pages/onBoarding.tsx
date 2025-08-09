import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CATEGORIES } from '@/constants/onBoarding/categoryList';

import Storage from '@/utils/storage';

import useCategory from '@/hooks/onBoarding/useCategory';

import Logo from '@/assets/sizeLogo.svg?react';

export default function OnBoarding() {
  const { mutate } = useCategory();
  const navigate = useNavigate();
  const [category, setCategory] = useState(1);
  const handleSubmit = () => {
    Storage.setCategory(category);
    mutate({ businessCategoryId: category });
    navigate('/home');
  };
  const handleSkip = () => {
    Storage.setCategory(1);
    mutate({ businessCategoryId: 1 });
    navigate('/home');
  };
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center relative px-4">
      <button className="text-body-regular text-black-4 absolute top-0 right-4 py-3.5 underline underline-offset-2" onClick={handleSkip}>
        건너뛰기
      </button>
      <div className="w-full flex flex-col items-center justify-center gap-11">
        <div className="w-40 h-9">
          <Logo />
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="mb-2 text-subtitle-medium">환영합니다!</p>
          <p className="text-body-regular">업종을 알려주시면</p>
          <p className="text-body-regular">필요한 상품만 쏙쏙 골라드릴게요.</p>
        </div>
        <div className="w-full grid grid-cols-2 gap-2">
          {CATEGORIES.map(({ id, name }) => (
            <button
              onClick={() => setCategory(id)}
              key={id}
              className={`${category === id ? 'border-orange' : 'border-black-1 text-black-3'} text-body-regular w-full px-4 py-3.5 rounded-sm bg-white border text-black `}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="w-full">
          <button className="w-full h-12 bg-orange rounded-sm text-white text-body-medium" onClick={handleSubmit}>
            선택 완료
          </button>
        </div>
      </div>
    </div>
  );
}
