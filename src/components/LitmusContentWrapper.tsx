import React from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { isLitmusAvailable } from '../plugin';
import { EntityLitmusContent } from './EntityLitmusContent';
import { MissingAnnotationEmptyState } from '@backstage/core-components';
import { LITMUS_PROJECT_ID } from './useLitmusAppData';

export const LitmusContentWrapper = () => {
  const { entity } = useEntity();
  const available = isLitmusAvailable(entity);

  if (!available) {
    return <MissingAnnotationEmptyState annotation={LITMUS_PROJECT_ID} />;
  }

  return <EntityLitmusContent />;
};
