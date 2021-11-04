import Layout from '../../components/Layout';
import OrderList from '../../components/OrderList';
import useAxios from '../../helpers/useAxios';
import withAuth from '../../helpers/withAuth';
import { Order } from '../../types/Order';

const AllOrders = () => {
  const { data, loading } = useAxios<Order[]>('/api/orders');

  return (
    <Layout title='All Orders'>
      {loading || !data ? <h1>Loading...</h1> : <OrderList data={data} />}
    </Layout>
  );
};

export default withAuth(AllOrders);
