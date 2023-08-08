import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const litmusPlugin = createPlugin({
  id: 'litmus',
  routes: {
    root: rootRouteRef,
  },
});

export const LitmusPage = litmusPlugin.provide(
  createRoutableExtension({
    name: 'LitmusPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
