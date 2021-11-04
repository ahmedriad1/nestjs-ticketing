import axios from 'axios';
import Link from 'next/link';
import { useState } from 'react';
import { useAuthDispatch, User } from '../contexts/AuthContext';
import Image from 'next/image';
import notify from '../helpers/notify';
import withGuest from '../helpers/withGuest';
import Layout from '../components/Layout';

const Register = () => {
  const [data, setData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState<string | { msgs: string[]; field: string }[]>(
    '',
  );
  const dispatch = useAuthDispatch();

  const handleChange = (name: keyof typeof data) => (e: any) =>
    setData({ ...data, [name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data: response } = await axios.post<User>('/api/auth/register', data);
      dispatch({ user: response, isLoggedIn: true });
      notify('success', 'Created account');
    } catch (error: any) {
      setMessage(error.response.data?.message);
    }
  };

  return (
    <Layout title='Register' template='headless'>
      <div className='flex flex-col justify-center'>
        <Image
          className='h-12 w-auto'
          src='/logo.svg'
          alt='Workflow'
          width={48}
          height={48}
        />
        <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
          Create an account
        </h2>
        <p className='mt-2 text-center text-sm text-gray-600'>
          Or{' '}
          <Link href='/login'>
            <a className='font-medium text-indigo-600 hover:text-indigo-500'>
              Already have an account ?
            </a>
          </Link>
        </p>
      </div>
      {message.length > 0 && (
        <div className='w-full bg-red-600 rounded px-4 py-2 text-white'>
          {Array.isArray(message) ? (
            <ul>
              {message.map(err =>
                err.msgs.map((msg, idx) => <li key={`${err.field}-${idx}`}>{msg}</li>),
              )}
            </ul>
          ) : (
            message
          )}
        </div>
      )}
      <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
        <input type='hidden' name='remember' defaultValue='true' />
        <div className='rounded-md shadow-sm -space-y-px'>
          <div>
            <label htmlFor='name' className='sr-only'>
              Name
            </label>
            <input
              id='name'
              type='text'
              className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
              placeholder='Name'
              value={data.name}
              onChange={handleChange('name')}
            />
          </div>
          <div>
            <label htmlFor='email-address' className='sr-only'>
              Email address
            </label>
            <input
              id='email-address'
              type='email'
              className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
              placeholder='Email address'
              value={data.email}
              onChange={handleChange('email')}
            />
          </div>
          <div>
            <label htmlFor='password' className='sr-only'>
              Password
            </label>
            <input
              id='password'
              type='password'
              className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
              placeholder='Password'
              value={data.password}
              onChange={handleChange('password')}
            />
          </div>
        </div>

        <div>
          <button
            type='submit'
            className='w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors'
          >
            Sign up
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default withGuest(Register);
