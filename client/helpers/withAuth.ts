import withConditionalRedirect from './withConditionalRedirect';

export default function withAuth(WrappedComponent: any, location = '/login') {
  return withConditionalRedirect({
    WrappedComponent,
    location,
    clientCondition: auth => !auth.isLoggedIn,
    serverCondition: ctx => !ctx.req?.cookies,
  });
}
