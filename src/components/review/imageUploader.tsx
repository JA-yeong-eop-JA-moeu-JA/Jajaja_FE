import type { ChangeEventHandler } from 'react';

import { useReviewImageStore } from '@/stores/reviewImageStore';
import { useImageUploader } from '@/hooks/s3/useImageUploader';

import Close from '@/assets/myPage/review/close.svg?react';
import Plus from '@/assets/myPage/review/plus.svg?react';

export default function ReviewImageUploader() {
  const { inputRef, images, openFileDialog, handleFileChange, deleteImage, files } = useImageUploader(5);
  const setFiles = useReviewImageStore((s) => s.setFiles);
  const onInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    handleFileChange(e);
    const picked = e.target.files ? Array.from(e.target.files) : [];
    const next = [...files, ...picked];
    setFiles(next);
  };

  const onDelete = (idx: number) => {
    deleteImage(idx);
    const next = files.filter((_, i) => i !== idx);
    setFiles(next);
  };

  return (
    <div className="flex flex-col w-full items-start">
      <p className="text-black text-body-medium">사진 첨부</p>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={onInputChange} />
      <div className="flex overflow-x-auto w-full gap-2 py-2">
        <button type="button" className="bg-black-1 flex items-center justify-center rounded-sm p-9" onClick={openFileDialog}>
          <Plus className="w-5 h-5" />
        </button>
        {images.map((img, idx) => (
          <div key={idx} className="relative flex-shrink-0 overflow-visible">
            <div className="object-cover w-23 h-23 overflow-hidden rounded-sm">
              <img src={img.url} alt={`첨부 이미지 ${idx + 1}`} className="w-full h-full object-cover" />
            </div>
            <button type="button" onClick={() => onDelete(idx)} className="absolute -top-1.5 -right-1.5">
              <Close className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
