import { useEffect, useState } from 'react';

const useExpiration = (date: string) => {
  const [timeLeft, setTimeLeft] = useState<number>(
    Math.floor((new Date(date).getTime() - new Date().getTime()) / 1000),
  );
  const [isExpired, setIsExpired] = useState<boolean>(
    Math.floor((new Date(date).getTime() - new Date().getTime()) / 1000) < 0,
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const timeLeft = Math.floor(
        (new Date(date).getTime() - new Date().getTime()) / 1000,
      );

      if (timeLeft < 0) {
        setIsExpired(true);
        clearInterval(interval);
      } else setTimeLeft(timeLeft);
    }, 1000);
    return () => clearInterval(interval);
  }, [date]);

  return { timeLeft, isExpired };
};

export default useExpiration;
