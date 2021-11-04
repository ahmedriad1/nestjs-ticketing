import Link from 'next/link';
import { Transition } from '@headlessui/react';
import { useState } from 'react';
import { useAuth, useAuthDispatch } from '../contexts/AuthContext';
import axios from 'axios';
import Image from 'next/image';
import notify from '../helpers/notify';

const links = [
  { href: '/', label: 'Home' },
  { href: '/orders', label: 'Orders' },
  { href: '/about', label: 'About' },
];

const Nav = () => {
  const auth = useAuth();
  const dispatch = useAuthDispatch();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const logout = async (e: any) => {
    e.preventDefault();
    await axios.post('/api/auth/logout');
    dispatch({ isLoggedIn: false, user: null });
    notify('success', 'Logged out');
    // setLogout();
    // toast('success', 'Logged out !');
  };

  return (
    <nav className='bg-gray-800'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <Image
                className='h-8 w-8'
                src='/logo.svg'
                alt='Workflow logo'
                width={32}
                height={32}
              />
            </div>
            <div className='hidden md:block'>
              <div className='ml-10 flex items-baseline'>
                {/* <NavLink
                to='/'
                className='px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:text-white focus:bg-gray-700 hover:text-white hover:bg-gray-700'
                activeClassName='text-white bg-gray-900 hover:bg-gray-900'
              >
                Home
              </NavLink> */}
                {links.map((link, idx) => (
                  <Link href={link.href} key={idx}>
                    <a className='px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:text-white focus:bg-gray-700 hover:text-white hover:bg-gray-700 text-gray-300'>
                      {link.label}
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className='hidden md:block'>
            {auth.isLoggedIn ? (
              <div className='ml-4 flex items-center md:ml-6'>
                <div className='ml-3 relative'>
                  <div>
                    <button
                      className='max-w-xs flex items-center text-sm rounded-full text-white focus:outline-none focus:shadow-solid'
                      id='user-menu'
                      aria-label='User menu'
                      aria-haspopup='true'
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                    >
                      <img
                        className='h-8 w-8 rounded-full'
                        src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                        alt=''
                      />
                    </button>
                  </div>
                  <Transition
                    show={isProfileOpen}
                    enter='transition ease-out duration-100 transform'
                    enterFrom='opacity-0 scale-95'
                    enterTo='opacity-100 scale-100'
                    leave='transition ease-in duration-75 transform'
                    leaveFrom='opacity-100 scale-100'
                    leaveTo='opacity-0 scale-95'
                  >
                    <div className='origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg'>
                      <div
                        className='py-1 rounded-md bg-white shadow-xs'
                        role='menu'
                        aria-orientation='vertical'
                        aria-labelledby='user-menu'
                      >
                        <Link href='/profile'>
                          <a
                            className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                            role='menuitem'
                          >
                            Your Profile
                          </a>
                        </Link>
                        <a
                          href='/logout'
                          onClick={logout}
                          className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                          role='menuitem'
                        >
                          Sign out
                        </a>
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>
            ) : (
              <div>
                <Link href='/login'>
                  <a className='ml-4 px-5 py-2 rounded-md text-sm font-medium text-gray-200 focus:outline-none focus:text-white focus:bg-indigo-600 hover:text-white hover:bg-indigo-600 bg-indigo-500'>
                    Login
                  </a>
                </Link>
              </div>
            )}
          </div>

          <div className='-mr-2 flex md:hidden'>
            {/* <!-- Mobile menu button --> */}
            <button
              className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white'
              onClick={() => setIsNavOpen(!isNavOpen)}
            >
              {isNavOpen ? (
                <svg
                  className='h-6 w-6'
                  stroke='currentColor'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              ) : (
                <svg
                  className='block h-6 w-6'
                  stroke='currentColor'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isNavOpen && (
        <div className='md:hidden'>
          <div className='px-2 pt-2 pb-3 sm:px-3'>
            {/* <NavLink
              to='/'
              className='block px-3 py-2 rounded-md text-base font-medium focus:outline-none focus:text-white focus:bg-gray-700'
              activeClassName='text-white bg-gray-900 hover:bg-gray-900'
            >
              Home
            </NavLink> */}
            {links.map(link => (
              <Link href={link.href} key={link.href}>
                <a className='block px-3 py-2 rounded-md text-base font-medium focus:outline-none hover:bg-gray-700 focus:text-white focus:bg-gray-700 text-gray-300'>
                  {link.label}
                </a>
              </Link>
            ))}
          </div>
          <div className='pt-4 pb-3 border-t border-gray-700'>
            {auth.isLoggedIn ? (
              <>
                <div className='flex items-center px-5'>
                  <div className='flex-shrink-0'>
                    <img
                      className='h-10 w-10 rounded-full'
                      src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                      alt=''
                    />
                  </div>
                  <div className='ml-3'>
                    <div className='text-base font-medium leading-none text-white'>
                      {auth.user!.name}
                    </div>
                    <div className='mt-1 text-sm font-medium leading-none text-gray-400'>
                      {auth.user!.email}
                    </div>
                  </div>
                </div>
                <div className='mt-3 px-2'>
                  <Link href='/profile'>
                    <a className='block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700'>
                      Your Profile
                    </a>
                  </Link>
                  <a
                    href='/logout'
                    onClick={logout}
                    className='mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700'
                  >
                    Sign out
                  </a>
                </div>
              </>
            ) : (
              <Link href='/login'>
                <a className='block px-3 py-2 rounded-md text-base font-medium focus:outline-none focus:text-white focus:bg-gray-700 bg-indigo-500 hover:bg-indigo-600 text-white mt-1 mx-2'>
                  Login
                </a>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;
