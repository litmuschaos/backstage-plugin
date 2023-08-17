import { createDevApp } from '@backstage/dev-utils';
import { litmusPlugin } from '../src/plugin';

createDevApp().registerPlugin(litmusPlugin).render();
