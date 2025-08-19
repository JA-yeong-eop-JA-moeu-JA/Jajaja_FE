import { type ChangeEvent, useEffect, useRef, useState } from 'react';

import { useReviewImageStore } from '@/stores/reviewImageStore';

interface IPreviewImage {
  file: File;
  url: string;
}

export function useImageUploader(maxCount: number = 5, overwrite: boolean = false) {
  const [images, setImages] = useState<IPreviewImage[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const { setFiles, reset } = useReviewImageStore();

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const selectedFiles = Array.from(files);

    if (overwrite) {
      images.forEach((img) => URL.revokeObjectURL(img.url));

      const preview = {
        file: selectedFiles[0],
        url: URL.createObjectURL(selectedFiles[0]),
      };

      setImages([preview]);
      setFiles([selectedFiles[0]]);
      return;
    }

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

    const nextImages = [...images, ...newPreviews];
    setImages(nextImages);

    setFiles(nextImages.map((img) => img.file));

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
    setFiles(remapped.map((img) => img.file));
  };

  const resetImages = () => {
    images.forEach((img) => URL.revokeObjectURL(img.url));
    setImages([]);
    reset();
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
  };
}
