import { InfoCard, Link, Table, TableColumn } from '@backstage/core-components';
import React from 'react';
import { LITMUS_PROJECT_ID, useLitmusAppData } from '../useLitmusAppData';
import { ErrorPanel, Progress } from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';
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

const columns: TableColumn[] = [
  { field: 'name', title: 'name' },
  { field: 'nextRun', title: 'next run' },
  { field: 'runs', title: 'recent experiment runs' },
  { field: 'infra', title: 'infra' },
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
  const { value, loading, error } = useAsync(async (): Promise<
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

  const data = value?.map(experiment => ({
    name: (
      <Link
        to={
          configApi.getString('litmus.baseUrl') +
          `/account/${accountID}/project/${projectID}/experiments/${experiment.experimentID}/chaos-studio`
        }
        target="_blank"
        underline="none"
        color="inherit"
      >
        {experiment.name}
      </Link>
    ),
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
  }));

  return (
    <InfoCard title="Experiments" className={classes.gridItemCard} noPadding>
      <Table
        options={{
          search: false,
          paging: true,
          toolbar: false,
          padding: 'dense',
        }}
        data={data || []}
        columns={columns}
      />
    </InfoCard>
  );
};
