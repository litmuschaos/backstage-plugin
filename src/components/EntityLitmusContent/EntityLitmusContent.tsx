import React from 'react';
import { Grid } from '@material-ui/core';
import { InfoCard } from '@backstage/core-components';
import { DevInfoCard } from './DevInfoCard';
import { ChaosHubsCard } from './ChaosHubsCard';
import { EnvironmentsCard } from './EnvironmentsCard';

export const EntityLitmusContent = () => {
  return (
    <Grid container spacing={3} alignItems="stretch">
      <Grid item md={3}>
        <DevInfoCard />
      </Grid>
      <Grid item md={4}>
        <ChaosHubsCard />
      </Grid>
      <Grid item md={5}>
        <EnvironmentsCard />
      </Grid>
      <Grid item md={12}>
        <InfoCard title="Experiment Runs" />
      </Grid>
    </Grid>
  );
};
