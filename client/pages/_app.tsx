import '../styles/globals.css';
import type { AppContext, AppProps } from 'next/app';
import axios from 'axios';
import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import { isBrowser } from '../helpers/functions';
import NextApp from 'next/app';

const App = ({ Component, pageProps, user }: AppProps & { user: any }) => {
  return (
    <AuthProvider defaultValue={{ user, isLoggedIn: !!user }}>
      <Component {...pageProps} />
      <Toaster position='top-right' reverseOrder={false} />
    </AuthProvider>
  );
};

App.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  if (isBrowser()) return { ...appProps };

  let user = null;
  const request = appContext.ctx.req;

  try {
    const { data } = await axios.get(
      'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/auth/me',
      {
        headers: {
          Host: 'tickiting.dev',
          Cookie: request!.headers?.cookie as string,
        },
      },
    );
    user = data;
  } catch (error) {}

  return {
    ...appProps,
    user,
  };
};

export default App;
