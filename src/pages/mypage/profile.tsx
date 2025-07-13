import { Button } from "@/components/common/button";
import PageHeaderBar from "@/components/head_bottom/PageHeader";
import DefaultProfile from "@/assets/myPage/defaultProfile.svg?react";
import { profileData } from "@/mocks/profileData";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const {name, phoneNumber, email, profileImage} = profileData;
  const navigate = useNavigate();
  return (
  <div className="w-full h-screen flex flex-col items-center justify-between">
    <div className="w-full">
      <PageHeaderBar title="프로필 수정" />

      <div className="w-full flex flex-col items-center justify-center px-4 pt-2 pb-11">
        {profileImage ? (
          <img
            src={profileImage}
            alt="프로필 이미지"
            className="w-30 h-30 rounded-full object-cover"
          />
        ) : (      
          <DefaultProfile className="w-30 h-30" />
        )}
        <button className="py-3.5"
          onClick={() => {}}>
          <p className="text-black text-body-regular underline">사진 변경</p>    
        </button>

        <div className="w-full mt-6 flex flex-col items-center justify-center gap-7">
          <div className="w-full flex flex-col items-start justify-center gap-3">
            <p className="text-body-medium">성함</p>
            <input
              type="text"
              defaultValue={name}
              className="w-full border border-black-1 px-3 py-2.5 rounded-sm text-body-regular text-black"
              placeholder="성함"
            />
          </div>
          <div className="w-full flex flex-col items-start justify-center gap-3">
            <p className="text-body-medium">휴대폰 번호</p>
            <input
              type="text"
              defaultValue={phoneNumber}
              className="w-full border border-black-1 px-3 py-2.5 rounded-sm text-body-regular text-black"
              placeholder="휴대폰 번호"
            />
          </div>
          <div className="w-full flex flex-col items-start justify-center gap-3">
            <p className="text-body-medium">이메일</p>
            <div className="w-full border border-black-1 px-3 py-2.5 rounded-sm bg-black-1 text-body-regular text-black-4">
              <p>{email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Button kind="basic" variant="solid-orange" onClick={() => navigate("/mypage")}>
      저장하기
    </Button>
  </div>
  );
}
