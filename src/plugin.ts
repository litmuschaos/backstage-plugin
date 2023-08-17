import {
  createApiFactory,
  createComponentExtension,
  createPlugin,
  createRoutableExtension,
  createRouteRef,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';
import { LitmusApiClient, litmusApiRef } from './api';
import { LITMUS_PROJECT_ID } from './components/useLitmusAppData';

export const entityContentRouteRef = createRouteRef({
  id: 'Litmus Entity Content',
});

export const litmusPlugin = createPlugin({
  id: 'backstage-plugin-litmus',
  routes: {
    root: entityContentRouteRef,
  },
  apis: [
    createApiFactory({
      api: litmusApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ discoveryApi, fetchApi }) =>
        new LitmusApiClient({
          discoveryApi,
          fetchApi,
        }),
    }),
  ],
});

export const EntityLitmusContent = litmusPlugin.provide(
  createRoutableExtension({
    name: 'EntityLitmusContent',
    component: () =>
      import('./components/EntityLitmusContent').then(
        m => m.EntityLitmusContent,
      ),
    mountPoint: entityContentRouteRef,
  }),
);

export const EntityLitmusCard = litmusPlugin.provide(
  createComponentExtension({
    name: 'EntityLitmusCard',
    component: {
      lazy: () =>
        import('./components/EntityLitmusCard').then(m => m.EntityLitmusCard),
    },
  }),
);

export const isLitmusAvailable = (entity: Entity) =>
  Boolean(entity?.metadata.annotations?.[LITMUS_PROJECT_ID]);
