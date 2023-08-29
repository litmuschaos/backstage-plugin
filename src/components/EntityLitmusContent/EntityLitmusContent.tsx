import React from 'react';
import { Grid } from '@material-ui/core';
import { DevInfoCard } from './DevInfoCard';
import { ChaosHubsCard } from './ChaosHubsCard';
import { EnvironmentsCard } from './EnvironmentsCard';
import { ExperimentsCard } from './ExperimentsCard';

export const EntityLitmusContent = () => {
  return (
    <Grid container spacing={2} alignItems="stretch">
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
        <ExperimentsCard />
      </Grid>
    </Grid>
  );
};
