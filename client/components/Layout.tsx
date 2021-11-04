import Head from 'next/head';
import Nav from './Nav';

interface LayoutProps {
  title: string;
  template?: 'default' | 'headless';
}

const Layout: React.FC<LayoutProps> = ({ children, title, template = 'default' }) => {
  if (template === 'headless')
    return (
      <>
        <Head>
          <title>{title}</title>
        </Head>
        <div className='min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-md w-full space-y-8'>{children}</div>
        </div>
      </>
    );

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div>
        <Nav />
        <header className='bg-white shadow'>
          <div className='max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'>
            <h1 className='text-3xl font-bold leading-tight text-gray-900'>
              {title || 'Home'}
            </h1>
          </div>
        </header>
        <main>
          <div className='max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'>{children}</div>
        </main>
      </div>
    </>
  );
};

export default Layout;
