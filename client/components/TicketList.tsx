import { Ticket } from '../types/Ticket';
import Link from 'next/link';

const TicketList: React.FC<{ data: Ticket[] }> = ({ data }) => {
  if (!data.length) return <h1 className='text-3xl text-red-600 mt-4'>No tickets</h1>;

  return (
    <div className='flex flex-col mt-4'>
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
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {data.map(ticket => (
                  <tr key={ticket.id}>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>{ticket.title}</div>
                    </td>

                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>{ticket.price}</div>
                    </td>

                    <td className='px-6 py-4 whitespace-nowrap'>
                      <Link href={`/tickets/${ticket.id}`}>
                        <a className='text-sm text-indigo-400'>View Ticket</a>
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

export default TicketList;
