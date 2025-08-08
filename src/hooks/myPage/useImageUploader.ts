// hooks/useImageUploader.ts
import { type ChangeEvent, useEffect, useRef, useState } from 'react';

interface IPreviewImage {
  file: File;
  url: string;
}

export function useImageUploader(maxCount: number = 5, overwrite: boolean = false) {
  const [images, setImages] = useState<IPreviewImage[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const selectedFiles = Array.from(files);

    // 덮어쓰기 모드 (ex. 프로필 이미지)
    if (overwrite) {
      images.forEach((img) => URL.revokeObjectURL(img.url));

      const preview = {
        file: selectedFiles[0],
        url: URL.createObjectURL(selectedFiles[0]),
      };

      setImages([preview]);
      e.target.value = '';
      return;
    }

    // 일반 모드 (ex. 리뷰 이미지 최대 5장)
    const currentCount = images.length;
    const totalCount = currentCount + selectedFiles.length;

    if (currentCount >= maxCount) {
      alert(`최대 ${maxCount}장까지 업로드할 수 있어요.`);
      e.target.value = '';
      return;
    }

    if (totalCount > maxCount) {
      alert(`최대 ${maxCount}장까지만 선택할 수 있어요.`);
    }

    const newPreviews = selectedFiles.slice(0, maxCount - currentCount).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages([...images, ...newPreviews]);
    e.target.value = '';
  };

  const deleteImage = (index: number) => {
    URL.revokeObjectURL(images[index].url);
    const remaining = images.filter((_, i) => i !== index);

    const remapped = remaining.map((img) => ({
      file: img.file,
      url: URL.createObjectURL(img.file),
    }));

    setImages(remapped);
  };

  const resetImages = () => {
    images.forEach((img) => URL.revokeObjectURL(img.url));
    setImages([]);
  };

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [images]);

  return {
    inputRef,
    images,
    openFileDialog,
    handleFileChange,
    deleteImage,
    resetImages,
    files: images.map((img) => img.file),
  };
}
