import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { litmusPlugin, LitmusDashboardPage } from '../src/plugin';

createDevApp()
  .registerPlugin(litmusPlugin)
  .addPage({
    element: <LitmusDashboardPage />,
    title: 'Root Page',
    path: '/litmus',
  })
  .render();
