import withConditionalRedirect from './withConditionalRedirect';

export default function withGuest(WrappedComponent: any, location = '/') {
  return withConditionalRedirect({
    WrappedComponent,
    location,
    clientCondition: auth => auth.isLoggedIn,
    serverCondition: ctx => !!ctx.req?.cookies,
  });
}
