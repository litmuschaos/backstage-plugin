import { ErrorBoundary, InfoCard } from '@backstage/core-components';
import { LinearProgress } from '@material-ui/core';
import React from 'react';

export const EntityLitmusCard = () => {
  // TODO: Add isLitmusAvailable();
  return (
    <ErrorBoundary>
      <InfoCard title="Litmus">
        <LinearProgress />
      </InfoCard>
    </ErrorBoundary>
  );
};
