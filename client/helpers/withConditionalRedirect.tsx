import { useRouter } from 'next/router';
import React from 'react';
import { IAuthState, useAuth } from '../contexts/AuthContext';
import { isBrowser } from './functions';

interface WithConditionalRedirectProps {
  WrappedComponent: any;
  clientCondition: (auth: IAuthState) => boolean;
  serverCondition: (ctx: any) => boolean;
  location: string;
}

export default function withConditionalRedirect({
  WrappedComponent,
  clientCondition,
  serverCondition,
  location,
}: WithConditionalRedirectProps) {
  const WithConditionalRedirectWrapper = (props: any) => {
    const router = useRouter();
    const auth = useAuth();
    const redirectCondition = clientCondition(auth);
    if (isBrowser() && redirectCondition) {
      router.push(location);
      return null;
    }
    return <WrappedComponent {...props} />;
  };

  WithConditionalRedirectWrapper.getInitialProps = async (ctx: any) => {
    if (!isBrowser() && ctx.res) {
      if (serverCondition(ctx)) {
        ctx.res.writeHead(302, { Location: location });
        ctx.res.end();
      }
    }

    const componentProps =
      WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx));

    return { ...componentProps };
  };

  return WithConditionalRedirectWrapper;
}
