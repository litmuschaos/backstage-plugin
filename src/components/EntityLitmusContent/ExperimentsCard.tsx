import { Link, Table, TableColumn } from '@backstage/core-components';
import React from 'react';
import { LITMUS_PROJECT_ID, useLitmusAppData } from '../useLitmusAppData';
import { ErrorPanel, Progress } from '@backstage/core-components';
import { useAsyncRetry } from 'react-use';
import { litmusApiRef } from '../../api';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useStyles } from './styles';
import { cloneDeep } from 'lodash-es';
import {
  Experiment,
  ExperimentRunStatus,
  RecentExecutions,
} from '../../types/Experiment';
import { StatusHeatMap } from './StatusHeatMap';
import parser from 'cron-parser';
import { IconButton, Tooltip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import LaunchIcon from '@mui/icons-material/Launch';
import SyncIcon from '@mui/icons-material/Sync';

const columns: TableColumn[] = [
  { field: 'name', title: 'name' },
  { field: 'nextRun', title: 'next run' },
  { field: 'runs', title: 'recent experiment runs' },
  { field: 'infra', title: 'infra' },
  { field: 'execute', title: '' },
  { field: 'launch', title: '' },
];

export const ExperimentsCard = () => {
  function orderExecutions(data: RecentExecutions[]): RecentExecutions[] {
    let recentExecutions: RecentExecutions[] = cloneDeep(data);
    if (recentExecutions.length < 10) {
      const fillExecutions = Array(10 - recentExecutions.length).fill({
        phase: ExperimentRunStatus.NA,
      });
      recentExecutions = [...recentExecutions, ...fillExecutions];
    }
    return recentExecutions.reverse();
  }

  const classes = useStyles();
  const { entity } = useEntity();
  const configApi = useApi(configApiRef);
  const { projectID, accountID } = useLitmusAppData({ entity });
  const litmusApi = useApi(litmusApiRef);
  const { value, loading, error, retry } = useAsyncRetry(async (): Promise<
    Experiment[] | undefined
  > => {
    const experiments: Promise<Experiment[] | undefined> =
      litmusApi.getExperiments({
        projectID,
      });
    return experiments;
  }, [entity.metadata.annotations?.[LITMUS_PROJECT_ID]]);

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return <ErrorPanel title={error.name} defaultExpanded error={error} />;
  }

  const data = value?.map(experiment => {
    const recentExecutions = experiment.recentExperimentRunDetails[0];
    const canNextRun = !(
      recentExecutions.phase === ExperimentRunStatus.RUNNING ||
      recentExecutions.phase === ExperimentRunStatus.QUEUED
    );
    return {
      name: <div>{experiment.name}</div>,
      nextRun: (
        <div>
          {experiment.cronSyntax === ''
            ? ' Non-Cron'
            : parser.parseExpression(experiment.cronSyntax).next().toString()}
        </div>
      ),
      infra: (
        <Link
          to={
            configApi.getString('litmus.baseUrl') +
            `/account/${accountID}/project/${projectID}/environments/${experiment.infra.environmentID}/kubernetes/${experiment.infra.infraID}`
          }
          target="_blank"
          underline="none"
          color="inherit"
        >
          {experiment.infra.name}
        </Link>
      ),
      runs: (
        <StatusHeatMap
          data={orderExecutions(experiment.recentExperimentRunDetails)}
          experimentID={experiment.experimentID}
        />
      ),
      execute: (
        <Tooltip title="Run Experiment">
          <IconButton
            onClick={() => {
              litmusApi
                .runChaosExperiment({
                  projectID: projectID,
                  experimentID: experiment.experimentID,
                })
                .then(retry);
            }}
            disabled={!canNextRun}
          >
            <PlayArrowIcon sx={{ color: canNextRun ? '#1bb954' : '#6a6d85' }} />
          </IconButton>
        </Tooltip>
      ),
      launch: (
        <Tooltip title="Go to details">
          <IconButton
            href={
              configApi.getString('litmus.baseUrl') +
              `/account/${accountID}/project/${projectID}/experiments/${experiment.experimentID}/chaos-studio`
            }
            target="_blank"
          >
            <LaunchIcon />
          </IconButton>
        </Tooltip>
      ),
    };
  });

  return (
    <div className={classes.gridItemCard}>
      <Table
        title="Experiments"
        actions={[
          {
            icon: () => <SyncIcon />,
            tooltip: 'Refresh',
            isFreeAction: true,
            onClick: retry,
          },
        ]}
        options={{
          search: false,
          paging: true,
          padding: 'dense',
        }}
        data={data || []}
        columns={columns}
      />
    </div>
  );
};
