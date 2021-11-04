import axios from 'axios';
import { useRouter } from 'next/router';
import ExpireTimer from '../../components/ExpireTimer';
import Layout from '../../components/Layout';
import notify from '../../helpers/notify';
import useAxios from '../../helpers/useAxios';
import { Order } from '../../types/Order';
import StripeCheckout from 'react-stripe-checkout';
import { useAuth } from '../../contexts/AuthContext';
import useExpiration from '../../helpers/useExpiration';
import withAuth from '../../helpers/withAuth';

const Info = ({ data }: { data: Order }) => {
  const auth = useAuth();
  const { isExpired } = useExpiration(data?.expiresAt as string);

  const onToken = async (token: { id: string }) => {
    await axios.post('/api/payments', { orderId: data?.id, token: token.id });
    notify('success', 'Payment created successfully');
  };
  return (
    <div>
      <h1 className='text-4xl font-semibold'>{data.ticket.title}</h1>
      <p className='mt-4 text-lg'>Price: ${data.ticket.price}</p>
      <p className='flex items-center'>
        Status: <ExpireTimer order={data} />
      </p>

      {!isExpired && (
        <StripeCheckout
          token={onToken}
          stripeKey='pk_test_51HC0jpKskSqddJPZ4NAPBPtVl9AYfqpIRvGO1JmX82oSe0hEvR8fwYLHOE33aLZco9c47U3M8oeGXxmrcz7gMv2K006kMVw1zE'
          amount={data.ticket.price * 100}
          email={auth.user?.email}
        />
      )}
    </div>
  );
};

const ShowOrder = () => {
  const {
    query: { id },
  } = useRouter();
  const { loading, data: order } = useAxios<Order>(`/api/orders/${id}`);

  return <Layout title='Show order'>{!loading && order && <Info data={order} />}</Layout>;
};

export default withAuth(ShowOrder);
