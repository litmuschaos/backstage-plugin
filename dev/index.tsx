import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { litmusPlugin, LitmusPage } from '../src/plugin';

createDevApp()
  .registerPlugin(litmusPlugin)
  .addPage({
    element: <LitmusPage />,
    title: 'Root Page',
    path: '/litmus'
  })
  .render();
