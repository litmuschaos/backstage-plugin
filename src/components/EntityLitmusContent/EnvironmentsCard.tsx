import { InfoCard, Link, Table, TableColumn } from '@backstage/core-components';
import React from 'react';
import { LITMUS_PROJECT_ID, useLitmusAppData } from '../useLitmusAppData';
import { ErrorPanel, Progress } from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';
import { litmusApiRef } from '../../api';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useStyles } from './styles';
import { Environment } from '../../types/Environment';
import { Chip } from '@material-ui/core';

const columns: TableColumn[] = [
  { field: 'name', title: 'name', width: '50%' },
  { field: 'type', title: 'type', width: '30%' },
  { field: 'isRemoved', title: 'is_removed', width: '10%' },
  { field: 'infras', title: 'infras', width: '10%' },
];

export const EnvironmentsCard = () => {
  const classes = useStyles();
  const { entity } = useEntity();
  const configApi = useApi(configApiRef);
  const { projectID, accountID } = useLitmusAppData({ entity });
  const litmusApi = useApi(litmusApiRef);
  const { value, loading, error } = useAsync(async (): Promise<
    Environment[] | undefined
  > => {
    const environments: Promise<Environment[] | undefined> =
      litmusApi.getEnvironments({
        projectID,
      });
    return environments;
  }, [entity.metadata.annotations?.[LITMUS_PROJECT_ID]]);

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return <ErrorPanel title={error.name} defaultExpanded error={error} />;
  }

  const data = value?.map(env => ({
    name: (
      <Link
        to={
          // TODO: fix link to id
          configApi.getString('litmus.baseUrl') +
          `/account/${accountID}/project/${projectID}/environments/${env.name}/kubernetes`
        }
        target="_blank"
        underline="none"
        color="inherit"
      >
        {env.name}
      </Link>
    ),
    type:
      env.type === 'NON_PROD' ? (
        <Chip
          size="small"
          label="pre-prod"
          style={{
            backgroundColor: '#eadeff',
            color: '#592aaa',
            marginLeft: '0',
            marginRight: '0',
            marginTop: '0',
            marginBottom: '0',
          }}
        />
      ) : (
        <Chip
          size="small"
          label="prod"
          style={{
            backgroundColor: '#d3fcfe',
            color: '#3cb7c4',
            marginLeft: '0',
            marginRight: '0',
            marginTop: '0',
            marginBottom: '0',
          }}
        />
      ),
    isRemoved: env.isRemoved,
    infras: env.infraIDs.length,
  }));

  return (
    <InfoCard title="Environments" className={classes.gridItemCard} noPadding>
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
