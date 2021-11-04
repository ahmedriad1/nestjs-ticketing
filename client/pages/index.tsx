import Layout from '../components/Layout';
import TicketList from '../components/TicketList';
import useAxios from '../helpers/useAxios';
import withAuth from '../helpers/withAuth';
import { Ticket } from '../types/Ticket';
import Link from 'next/link';

const Home = () => {
  const { data, loading } = useAxios<Ticket[]>('/api/tickets');

  return (
    <Layout title='Home'>
      <Link href='/tickets/add'>
        <a className='px-6 py-2 bg-green-600 text-white rounded'>Create ticket</a>
      </Link>
      {loading || !data ? <h1>Loading...</h1> : <TicketList data={data} />}
    </Layout>
  );
};

export default withAuth(Home);
