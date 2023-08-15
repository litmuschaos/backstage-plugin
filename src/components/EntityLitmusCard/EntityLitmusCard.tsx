import {
  ErrorBoundary,
  InfoCard,
  MissingAnnotationEmptyState,
} from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import React from 'react';
import { isLitmusAvailable } from '../../plugin';
import { LITMUS_PROJECT_ID, useLitmusAppData } from '../useLitmusAppData';

export const EntityLitmusCard = () => {
  const { entity } = useEntity();
  const { projectID } = useLitmusAppData({ entity });
  return !isLitmusAvailable(entity) ? (
    <MissingAnnotationEmptyState annotation={LITMUS_PROJECT_ID} />
  ) : (
    <ErrorBoundary>
      <InfoCard title="Litmus">{projectID}</InfoCard>
    </ErrorBoundary>
  );
};
