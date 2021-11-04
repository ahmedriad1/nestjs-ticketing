import Link from 'next/link';
import { Order } from '../types/Order';
import ExpireTimer from './ExpireTimer';

const OrderList: React.FC<{ data: Order[] }> = ({ data }) => {
  if (!data.length) return <h1 className='text-3xl text-red-600'>No orders</h1>;

  return (
    <div className='flex flex-col'>
      <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
        <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
          <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Title
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Price
                  </th>

                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Expires At
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {data.map(order => (
                  <tr key={order.id}>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>{order.ticket.title}</div>
                    </td>

                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>{order.ticket.price}</div>
                    </td>

                    <td className='px-6 py-4 whitespace-nowrap'>
                      <ExpireTimer order={order} />
                    </td>

                    <td className='px-6 py-4 whitespace-nowrap'>
                      <Link href={`/orders/${order.id}`}>
                        <a className='text-sm text-indigo-400'>View order</a>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
