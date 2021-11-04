import useExpiration from '../helpers/useExpiration';
import { Order } from '../types/Order';

const Timer = ({ time }: { time: string }) => {
  const { timeLeft, isExpired } = useExpiration(time);
  if (isExpired) return <p className='text-red-600'>Expired</p>;
  return <p className='expire-timer__time'>{timeLeft} sec</p>;
};

const ExpireTimer: React.FC<{ order: Order }> = ({ order }) => {
  if (order.status === 'complete')
    return <p className='text-sm text-green-600'>Complete</p>;
  if (order.status === 'cancelled')
    return <p className='text-sm text-red-600'>Cancelled</p>;
  return (
    <p className='text-sm text-gray-900'>
      <Timer time={order.expiresAt} />
    </p>
  );
};

export default ExpireTimer;
