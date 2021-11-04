import axios from 'axios';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import notify from '../../helpers/notify';
import withAuth from '../../helpers/withAuth';

const AddTicket = () => {
  const router = useRouter();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const title = e.target['title'].value;
    const price = e.target['price'].value;
    await axios.post('/api/tickets', { title, price });
    notify('success', 'Ticket created successfully !');
    router.push('/');
  };

  return (
    <Layout title='Add a ticket'>
      <form className='mt-4' onSubmit={handleSubmit}>
        <div className='sm:flex space-y-6 sm:space-x-8 sm:space-y-0'>
          <div className='sm:w-1/2'>
            <label htmlFor='title' className='block text-sm mb-2'>
              Title
            </label>
            <input
              className='appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5'
              name='title'
              id='title'
              type='text'
            />
          </div>
          <div className='sm:w-1/2'>
            <label htmlFor='price' className='block text-sm mb-2'>
              Price
            </label>
            <input
              className='appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5'
              name='price'
              id='price'
              type='number'
            />
          </div>
        </div>
        <button
          className='px-4 py-2 rounded bg-indigo-500 hover:bg-indigo-600 text-white mt-6 focus:outline-none focus:bg-indigo-600 flex justify-center items-center'
          type='submit'
        >
          Create
        </button>
      </form>
    </Layout>
  );
};

export default withAuth(AddTicket);
