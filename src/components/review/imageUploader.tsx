import { type ChangeEvent, useRef, useState } from 'react';

import Close from '@/assets/myPage/review/close.svg?react';
import Plus from '@/assets/myPage/review/plus.svg?react';

interface IReviewImageUploaderProps {
  maxCount?: number;
  onChange?: (files: File[]) => void;
}

interface IPreviewImage {
  file: File;
  url: string;
}

export default function ReviewImageUploader({ maxCount = 5, onChange }: IReviewImageUploaderProps) {
  const [images, setImages] = useState<IPreviewImage[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (images.length >= maxCount) return;
    inputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPreviews: IPreviewImage[] = [];
    for (let i = 0; i < files.length; i++) {
      if (images.length + newPreviews.length >= maxCount) break;
      const file = files[i];
      const url = URL.createObjectURL(file);
      newPreviews.push({ file, url });
    }

    const updated = [...images, ...newPreviews];
    setImages(updated);
    onChange?.(updated.map((p) => p.file));
    e.target.value = '';
  };

  const handleDelete = (index: number) => {
    const removed = images.filter((_, i) => i !== index);
    setImages(removed);
    onChange?.(removed.map((p) => p.file));
  };

  return (
    <div className="flex flex-col w-full items-start">
      <p className="text-black text-body-medium">사진 첨부</p>

      <input type="file" accept="image/*" multiple className="hidden" ref={inputRef} onChange={handleFileChange} />
      <div className="flex overflow-x-auto w-full gap-2 py-2">
        <button type="button" className="bg-black-1 flex items-center justify-center rounded-sm p-9" onClick={handleButtonClick}>
          <Plus className="w-5 h-5" />
        </button>
        {images.map((img, idx) => (
          <div key={idx} className="relative flex-shrink-0 overflow-visible">
            <div className="object-cover w-23 h-23 overflow-hidden rounded-sm">
              <img src={img.url} alt={`첨부 이미지 ${idx + 1}`} className="w-full h-full object-cover" />
            </div>
            <button type="button" onClick={() => handleDelete(idx)} className="absolute -top-1.5 -right-1.5">
              <Close className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
