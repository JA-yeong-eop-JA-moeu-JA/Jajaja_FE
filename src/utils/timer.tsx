import { useEffect, useState } from 'react';

type TProps = {
  expireAt: string;
};

export function Timer({ expireAt }: TProps) {
  const [remaining, setRemaining] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const expire = new Date(expireAt + '+09:00');

      const diff = expire.getTime() - now.getTime();

      if (diff <= 0) {
        setRemaining('0:00');
        clearInterval(interval);
        return;
      }

      const minutes = Math.floor(diff / 1000 / 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [expireAt]);
  if (!remaining) return null;
  return <span className="text-body-medium text-green-hover">{remaining}</span>;
}
