import { useEffect, useState } from 'react';

import usePatchUserInfo from '@/hooks/members/usePatchUserInfo';
import useUserInfo from '@/hooks/members/useUserInfo';
import { useImageUploader } from '@/hooks/s3/useImageUploader';
import usePostUpload from '@/hooks/s3/usePostUpload';
import usePutUpload from '@/hooks/s3/usePutUpload';

import { Button } from '@/components/common/button';
import PageHeaderBar from '@/components/head_bottom/PageHeader';

export default function Profile() {
  const { data } = useUserInfo();
  const { mutate } = usePatchUserInfo();
  const { mutateAsync: requestPresignedUrl } = usePostUpload();
  const { mutateAsync: putUpload } = usePutUpload();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [useDefaultImage, setUseDefaultImage] = useState(false);
  const defaultImageUrl = 'https://jajaja-bucket.s3.ap-northeast-2.amazonaws.com/default-profile-image.png';
  const nameRegex = /^[가-힣]{2,4}$/;
  const phoneRegex = /^(\d{10}|\d{11}|\d{12})$/;
  const stripHyphen = (value: string) => value.replace(/-/g, '');
  const formatPhone = (value: string) => {
    const onlyNums = value.replace(/\D/g, '');
    if (onlyNums.length <= 3) return onlyNums;
    if (onlyNums.length <= 7) return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
    return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7, 11)}`;
  };

  useEffect(() => {
    if (data?.result.name) {
      setName(data.result.name);
    }
    if (data?.result.phone) {
      setPhone(formatPhone(data.result.phone));
    }
    if (data?.result.profileUrl === defaultImageUrl) {
      setUseDefaultImage(true);
    }
  }, [data]);

  const { inputRef, images, openFileDialog, handleFileChange, resetImages, files } = useImageUploader(1, true);

  const currentPreviewUrl = useDefaultImage ? defaultImageUrl : images[0]?.url || data?.result.profileUrl;

  const handleSetDefaultImage = () => {
    resetImages();
    setUseDefaultImage(true);
  };

  useEffect(() => {
    if (images[0]) {
      setUseDefaultImage(false);
    }
  }, [images]);

  const handleSubmit = async () => {
    const rawPhone = stripHyphen(phone);
    if (!nameRegex.test(name)) {
      alert('이름은 한글 2~4자여야 합니다.');
      return;
    }
    if (!phoneRegex.test(rawPhone)) {
      alert('전화번호는 숫자만 10~12자여야 합니다.');
      return;
    }

    let profileKeyName: string | undefined = undefined;
    if (!useDefaultImage && files[0]) {
      try {
        const { result } = await requestPresignedUrl({ fileName: files[0].name });

        await putUpload({ url: result.url, file: files[0] });

        profileKeyName = result.keyName;
      } catch (error) {
        alert('이미지 업로드에 실패했습니다.');
        return error;
      }
    }

    mutate({
      memberId: data?.result.id ?? 0,
      memberData: {
        name,
        phone: rawPhone,
        profileKeyName: useDefaultImage ? '' : profileKeyName,
      },
    });
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-between">
      <div className="w-full">
        <PageHeaderBar title="프로필 수정" />

        <div className="w-full flex flex-col items-center justify-center px-4 pt-2">
          <img src={currentPreviewUrl} alt="프로필 이미지" className="w-30 h-30 rounded-full object-cover" />
          <div className="flex justify-center items-center gap-3 py-3.5">
            <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            <button className="text-black text-body-regular underline" onClick={openFileDialog}>
              사진 변경
            </button>

            {currentPreviewUrl && !useDefaultImage && (
              <button onClick={handleSetDefaultImage} className="text-black text-body-regular underline">
                기본 이미지로 변경
              </button>
            )}
          </div>

          <div className="w-full mt-6 flex flex-col items-center justify-center gap-7">
            <div className="w-full flex flex-col items-start justify-center gap-3">
              <p className="text-body-medium">성함</p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-black-1 px-3 py-2.5 rounded text-body-regular text-black"
                placeholder="성함"
              />
            </div>
            <div className="w-full flex flex-col items-start justify-center gap-3">
              <p className="text-body-medium">휴대폰 번호</p>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                className="w-full border border-black-1 px-3 py-2.5 rounded text-body-regular text-black"
                placeholder="010-0000-0000"
              />
            </div>
            <div className="w-full flex flex-col items-start justify-center gap-3">
              <p className="text-body-medium">이메일</p>
              <div className="w-full border border-black-1 px-3 py-2.5 rounded bg-black-1 text-body-regular text-black-4">
                <p>{data?.result.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button kind="basic" variant="solid-orange" onClick={handleSubmit}>
        저장하기
      </Button>
    </div>
  );
}
