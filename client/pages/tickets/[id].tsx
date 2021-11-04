import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import notify from '../../helpers/notify';
import useAxios from '../../helpers/useAxios';
import withAuth from '../../helpers/withAuth';
import { Order } from '../../types/Order';
import { Ticket } from '../../types/Ticket';

const ShowTicket = () => {
  const {
    query: { id },
    push,
  } = useRouter();
  const { loading, data: ticket } = useAxios<Ticket>(`/api/tickets/${id}`);

  const handleBuy = async () => {
    await axios.post<Order>(`/api/orders`, { ticketId: ticket?.id });

    notify('success', 'Order created successfully !');
    push(`/orders`);
  };

  const status = !ticket?.orderId;

  return (
    <Layout title='Show ticket'>
      {!loading && ticket && (
        <div>
          <h1 className='text-4xl font-semibold'>{ticket.title}</h1>
          <p className='mt-4 text-lg'>Price: ${ticket.price}</p>
          <p className={`mt-2 text-lg ${status ? 'text-green-500' : 'text-red-500'}`}>
            Status: {status ? 'Available' : 'Reserved'}
          </p>
          {status && (
            <button
              className='mt-6 px-6 py-2 bg-indigo-500 hover:bg-indigo-600 rounded text-white'
              onClick={handleBuy}
            >
              Buy
            </button>
          )}
        </div>
      )}
    </Layout>
  );
};

export default withAuth(ShowTicket);
