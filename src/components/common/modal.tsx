import { createElement, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';

import { useModalStore } from '@/stores/modalStore';

import Bar from '@/assets/icons/modalBar.svg?react';

interface IModalProviderProps {
  children: ReactNode;
}

export default function ModalProvider({ children }: IModalProviderProps) {
  const { isModalOpen, modalContent, type, options, closeModal } = useModalStore();

  const isSlidingType = useMemo(() => type === 'bottom-drawer' || type === 'bottom-drawer-team' || type === 'cart-option' || type === 'bottom-sheet', [type]);
  const [entered, setEntered] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const baseHeight = 152;
  const DRAG_THRESHOLD = 10;

  const [currentHeight, setCurrentHeight] = useState(baseHeight);
  const [isDragging, setIsDragging] = useState(false);

  const startY = useRef<number | null>(null);
  const startHeight = useRef<number>(baseHeight);

  const onStart = (clientY: number) => {
    startY.current = clientY;
    startHeight.current = currentHeight;
    setIsDragging(true);
  };

  const onMove = (clientY: number) => {
    if (!isDragging || startY.current === null) return;
    const delta = startY.current - clientY;
    const nextHeight = startHeight.current + delta;
    const clamped = Math.max(baseHeight, Math.min(nextHeight, window.innerHeight));
    setCurrentHeight(clamped);
  };

  const onEnd = () => {
    if (startY.current === null) return;
    const movedDistance = Math.abs(currentHeight - startHeight.current);

    if (movedDistance < DRAG_THRESHOLD) {
      setIsDragging(false);
      setCurrentHeight(startHeight.current);
      startY.current = null;
      return;
    }

    if (currentHeight > window.innerHeight / 2) {
      setCurrentHeight(window.innerHeight);
    } else {
      setCurrentHeight(baseHeight);
    }

    setIsDragging(false);
    startY.current = null;
  };

  useEffect(() => {
    if (!isModalOpen) return;
    setCurrentHeight(baseHeight);
    setIsDragging(false);
    startY.current = null;
    startHeight.current = baseHeight;

    if (isSlidingType) {
      setEntered(false);
      const raf = requestAnimationFrame(() => setEntered(true));
      return () => cancelAnimationFrame(raf);
    }
  }, [isModalOpen, isSlidingType]);

  useEffect(() => {
    setCurrentHeight(baseHeight);
    setIsDragging(false);
    startY.current = null;
    startHeight.current = baseHeight;
  }, [isModalOpen]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => onMove(e.clientY);
    const handleTouchMove = (e: TouchEvent) => onMove(e.touches[0].clientY);
    const handleMouseUp = () => onEnd();
    const handleTouchEnd = () => onEnd();

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, currentHeight]);

  if (!isModalOpen || !modalContent) return <>{children}</>;

  const closeWithSlide = () => {
    if (!isSlidingType) {
      closeModal();
      return;
    }
    setEntered(false);
    setTimeout(() => {
      closeModal();
    }, 250);
  };

  return (
    <>
      {children}

      {(type === 'bottom-drawer' || type == 'bottom-drawer-team' || type === 'cart-option') && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center" onClick={closeWithSlide}>
          <div
            ref={drawerRef}
            onClick={(e) => e.stopPropagation()}
            className={[
              'w-full max-w-150 bg-white rounded-t-lg overflow-hidden',
              isDragging ? 'transition-none' : 'transition-transform duration-250 ease-out',
              entered ? 'translate-y-0' : 'translate-y-full',
            ].join(' ')}
            style={{ minHeight: currentHeight }}
            onMouseDown={(e) => onStart(e.clientY)}
            onTouchStart={(e) => onStart(e.touches[0].clientY)}
          >
            <div className="flex flex-col">
              <div className="w-full flex justify-center cursor-grab active:cursor-grabbing mt-3 mb-5">
                <Bar />
              </div>
              {createElement(modalContent)}
            </div>
          </div>
        </div>
      )}

      {type === 'bottom-sheet' && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center" onClick={closeModal}>
          <div
            className={[
              'h-fit min-h-20 max-w-150 w-full bg-white rounded-t-lg',
              'transition-transform duration-250 ease-out',
              entered ? 'translate-y-0' : 'translate-y-full',
            ].join(' ')}
            onClick={(e) => e.stopPropagation()}
          >
            {createElement(modalContent)}
          </div>
        </div>
      )}

      {type === 'alert' && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center" onClick={closeModal}>
          <div className="bg-white min-h-10 rounded-lg shadow-md max-w-76 w-full" onClick={(e) => e.stopPropagation()}>
            {createElement(modalContent)}
          </div>
        </div>
      )}
      {type === 'image' && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={closeModal}>
          <div onClick={(e) => e.stopPropagation()}>{createElement(modalContent, options)}</div>
        </div>
      )}
      {type === 'delivery' && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center" onClick={closeModal}>
          <div className="h-fit min-h-20 max-w-150 w-full bg-white rounded-t-lg" onClick={(e) => e.stopPropagation()}>
            {createElement(modalContent)}
          </div>
        </div>
      )}
      {(type === 'login' || type === 'confirm') && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white min-h-10 rounded-lg shadow-md max-w-76 w-full" onClick={(e) => e.stopPropagation()}>
            {createElement(modalContent, options)}
          </div>
        </div>
      )}
    </>
  );
}
