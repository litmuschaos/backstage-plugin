import React, { ReactNode } from 'react';
import { LITMUS_PROJECT_ID, useLitmusAppData } from '../useLitmusAppData';
import { ErrorPanel, Progress } from '@backstage/core-components';
import { Entity } from '@backstage/catalog-model';
import useAsync from 'react-use/lib/useAsync';
import { BasicStats } from '../../types/BasicStats';
import { litmusApiRef } from '../../api';
import { useApi } from '@backstage/core-plugin-api';
import { Box, Grid, Typography, makeStyles } from '@material-ui/core';
import Stack from '@mui/material/Stack';

export const BasicStatsSection = ({ entity }: { entity: Entity }) => {
  const { projectID } = useLitmusAppData({ entity });
  const litmusApi = useApi(litmusApiRef);
  const { value, loading, error } = useAsync(async (): Promise<
    BasicStats | undefined
  > => {
    const basicStats: Promise<BasicStats | undefined> = litmusApi.getBasicStats(
      {
        projectID,
      },
    );
    return basicStats;
  }, [entity.metadata.annotations?.[LITMUS_PROJECT_ID]]);

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return <ErrorPanel title={error.name} defaultExpanded error={error} />;
  }
  return (
    <Box>
      <Grid container spacing={2} alignItems="center" alignContent="center">
        <Grid item xs={7}>
          <StatCard title="ChaosHubs" value={value?.totalChaosHubs} />
        </Grid>
        <Grid item xs={5}>
          <StatCard title="Infras" value={value?.totalInfrastructure} />
        </Grid>
        <Grid item xs={7}>
          <StatCard title="Experiments" value={value?.totalExperiments} />
        </Grid>
        <Grid item xs={5}>
          <StatCard title="GitOps" value={value?.gitOps ? 'YES' : 'NO'} />
        </Grid>
      </Grid>
    </Box>
  );
};

const useStyles = makeStyles(theme => ({
  value: {
    fontWeight: 'bold',
    fontSize: '36px',
    overflow: 'hidden',
    wordBreak: 'break-word',
  },
  label: {
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
    fontSize: '10px',
    fontWeight: 'bold',
    letterSpacing: 0.5,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
}));

const StatCard = ({ title, value }: { title: string; value: ReactNode }) => {
  const classes = useStyles();
  return (
    <Stack direction="column" spacing={2} width="100%" textAlign="center">
      <Box>
        <Typography align="center" className={classes.label}>
          {title}
        </Typography>
      </Box>
      <Box>
        <Typography align="center" className={classes.value}>
          {value}
        </Typography>
      </Box>
    </Stack>
  );
};
