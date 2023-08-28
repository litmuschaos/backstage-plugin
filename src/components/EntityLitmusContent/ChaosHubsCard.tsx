import {
  InfoCard,
  StatusOK,
  StatusError,
  Table,
  TableColumn,
  Link,
} from '@backstage/core-components';
import React from 'react';
import { LITMUS_PROJECT_ID, useLitmusAppData } from '../useLitmusAppData';
import { ErrorPanel, Progress } from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';
import { litmusApiRef } from '../../api';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { ChaosHub } from '../../types/ChaosHub';
import { useStyles } from './styles';
import { Typography } from '@material-ui/core';

const litmusChaosHubURL = 'https://hub.litmuschaos.io/';

const columns: TableColumn[] = [
  { field: 'name', title: 'name', width: '80%' },
  { field: 'experiments', title: 'experiments', width: '10%' },
  { field: 'faults', title: 'faults', width: '10%' },
];

export const ChaosHubsCard = () => {
  const classes = useStyles();
  const { entity } = useEntity();
  const configApi = useApi(configApiRef);
  const { projectID, accountID } = useLitmusAppData({ entity });
  const litmusApi = useApi(litmusApiRef);
  const { value, loading, error } = useAsync(async (): Promise<
    ChaosHub[] | undefined
  > => {
    const chaosHubs: Promise<ChaosHub[] | undefined> = litmusApi.getChaosHubs({
      projectID,
    });
    return chaosHubs;
  }, [entity.metadata.annotations?.[LITMUS_PROJECT_ID]]);

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return <ErrorPanel title={error.name} defaultExpanded error={error} />;
  }

  const data = value?.map(hub => ({
    name: (
      <Link
        to={
          configApi.getString('litmus.baseUrl') +
          `/account/${accountID}/project/${projectID}/chaos-hubs/${hub.id}`
        }
        target="_blank"
        underline="none"
        color="inherit"
      >
        <Typography noWrap>
          {hub.isAvailable ? <StatusOK /> : <StatusError />}
          {hub.name}
        </Typography>
      </Link>
    ),
    experiments: hub.totalExperiments,
    faults: hub.totalFaults,
  }));

  return (
    <InfoCard
      title="ChaosHubs"
      deepLink={{ title: 'Go to Docs', link: litmusChaosHubURL }}
      className={classes.gridItemCard}
      noPadding
    >
      <Table
        options={{
          search: false,
          paging: true,
          pageSizeOptions: [5],
          toolbar: false,
          padding: 'dense',
        }}
        data={data || []}
        columns={columns}
      />
    </InfoCard>
  );
};
