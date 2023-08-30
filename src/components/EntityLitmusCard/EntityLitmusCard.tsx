import {
  ErrorBoundary,
  InfoCard,
  MissingAnnotationEmptyState,
} from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import React from 'react';
import { isLitmusAvailable } from '../../plugin';
import { LITMUS_PROJECT_ID } from '../useLitmusAppData';
import Grid from '@material-ui/core/Grid';
import { ExperimentRunStatsSection } from './ExperimentRunStatsSection';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { BasicStatsSection } from './BasicStatsSection';

export const EntityLitmusCard = () => {
  const { entity } = useEntity();
  const configApi = useApi(configApiRef);
  const litmusURL = configApi.getString('litmus.baseUrl');
  return isLitmusAvailable(entity) ? (
    <ErrorBoundary>
      <InfoCard
        title="Litmus"
        deepLink={{ title: 'Go to Dashboard', link: litmusURL }}
      >
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <ExperimentRunStatsSection entity={entity} />
          </Grid>
          <Grid item xs={6}>
            <BasicStatsSection entity={entity} />
          </Grid>
        </Grid>
      </InfoCard>
    </ErrorBoundary>
  ) : (
    <MissingAnnotationEmptyState annotation={LITMUS_PROJECT_ID} />
  );
};
