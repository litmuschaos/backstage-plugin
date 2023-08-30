import React from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PauseIcon from '@mui/icons-material/Pause';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';
import NotInterestedOutlinedIcon from '@mui/icons-material/NotInterestedOutlined';
import { ExperimentRunStatus, RecentExecutions } from '../../types/Experiment';
import { makeStyles } from '@material-ui/core';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Link } from '@backstage/core-components';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { useLitmusAppData } from '../useLitmusAppData';

const useStyles = makeStyles(() => ({
  statusHeatMap: {
    display: 'flex',
    alignItems: 'end',
    columnGap: '0.25rem',
    lineHeight: 0,
  },
  statusHeatMapCell: {
    width: '18px',
    height: '18px',
    borderRadius: '2px',
    flex: '0 0 auto',
    outline: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&[data-state="completed"]': {
      backgroundColor: '#4dc952',
      '&:hover, &:focus': {
        boxShadow: '#fff 0px 0px 0px 1px, #d8f3d4 0px 0px 0px 2px',
      },
    },
    '&[data-state="queued"]': {
      backgroundColor: '#e5e1f4',
      '&:hover, &:focus': {
        boxShadow: '#fff 0px 0px 0px 1px, #e5e1f4 0px 0px 0px 2px',
      },
    },
    '&[data-state="completed_with_error"]': {
      backgroundColor: '#ff832b',
      '&:hover, &:focus': {
        boxShadow: '#fff 0px 0px 0px 1px, #fff0e6	 0px 0px 0px 2px',
      },
    },
    '&[data-state="completed_with_probe_failure"]': {
      backgroundColor: '#ff832b',
      '&:hover, &:focus': {
        boxShadow: '#fff 0px 0px 0px 1px, #fff0e6 0px 0px 0px 2px',
      },
    },
    '&[data-state="error"]': {
      backgroundColor: '#fcedec',
      '&:hover, &:focus': {
        boxShadow: '#fff 0px 0px 0px 1px, #fbe6e4 0px 0px 0px 2px',
      },
    },
    '&[data-state="timeout"]': {
      backgroundColor: '#fcedec',
      '&:hover, &:focus': {
        boxShadow: '#fff 0px 0px 0px 1px, #fbe6e4 0px 0px 0px 2px',
      },
    },
    '&[data-state="running"]': {
      backgroundColor: '#5b44ba',
      '&:hover, &:focus': {
        boxShadow: '#fff 0px 0px 0px 1px, #e5e1f4 0px 0px 0px 2px',
      },
    },
    '&[data-state="stopped"]': {
      backgroundColor: '#d9dae5',
      '&:hover, &:focus': {
        boxShadow: '#fff 0px 0px 0px 1px, #d9dae5 0px 0px 0px 2px',
      },
    },
    '&[data-state="na"]': {
      height: '12px',
      backgroundColor: '#d9dae5',
      '&:hover, &:focus': {
        boxShadow: '#fff 0px 0px 0px 1px, #d9dae5 0px 0px 0px 2px',
      },
    },
  },
}));

function StatusIcon({ status }: StatusIcon): React.ReactElement {
  switch (status) {
    case ExperimentRunStatus.COMPLETED:
      return <CheckCircleIcon style={{ color: '#1b841d', fontSize: '12px' }} />;
    case ExperimentRunStatus.COMPLETED_WITH_PROBE_FAILURE:
    case ExperimentRunStatus.COMPLETED_WITH_ERROR: // <!-- needed for backwards compatibility -->
      return <ErrorIcon style={{ color: '#ff832b', fontSize: '12px' }} />;
    case ExperimentRunStatus.ERROR:
      return <CancelIcon style={{ color: '#da291d', fontSize: '12px' }} />;
    case ExperimentRunStatus.TIMEOUT:
      return <AccessTimeIcon style={{ color: '#da291d', fontSize: '12px' }} />;
    case ExperimentRunStatus.RUNNING:
      return <MoreHorizIcon style={{ color: '#ffffff', fontSize: '12px' }} />;
    case ExperimentRunStatus.QUEUED:
      return <PauseIcon style={{ fontSize: 12, color: '#9d8ed6' }} />;
    case ExperimentRunStatus.STOPPED:
      return (
        <StopCircleOutlinedIcon
          style={{ color: '#383946', fontSize: '12px' }}
        />
      );
    default:
      return (
        <NotInterestedOutlinedIcon
          sx={{ color: '#383946', fontSize: '12px' }}
        />
      );
  }
}

interface StatusCell {
  execution: RecentExecutions;
}

interface StatusIcon {
  status: ExperimentRunStatus;
}

export interface StatusHeatMapProps {
  data: RecentExecutions[];
  experimentID: string;
}

export function StatusHeatMap(props: StatusHeatMapProps): React.ReactElement {
  const classes = useStyles();
  const { data, experimentID } = props;
  const { entity } = useEntity();
  const configApi = useApi(configApiRef);
  const { projectID, accountID } = useLitmusAppData({ entity });
  function hideIconForStatus(
    experimentRunStatus: ExperimentRunStatus,
  ): boolean {
    switch (experimentRunStatus) {
      case ExperimentRunStatus.COMPLETED:
      case ExperimentRunStatus.COMPLETED_WITH_PROBE_FAILURE:
      case ExperimentRunStatus.COMPLETED_WITH_ERROR:
      case ExperimentRunStatus.NA:
        return true;
      default:
        return false;
    }
  }

  function StatusCell({ execution }: StatusCell): React.ReactElement {
    return (
      <div
        data-state={execution?.phase?.replace(/ /g, '_').toLowerCase()}
        className={classes.statusHeatMapCell}
      >
        {!hideIconForStatus(execution.phase) && (
          <StatusIcon status={execution.phase} />
        )}
      </div>
    );
  }

  return (
    <div className={classes.statusHeatMap}>
      {data.map((recentExecutions, index) => {
        return (
          <Link
            key={index}
            to={
              configApi.getString('litmus.baseUrl') +
              `/account/${accountID}/project/${projectID}/experiments/${experimentID}/runs/${
                recentExecutions.experimentRunID
                  ? recentExecutions.experimentRunID
                  : ''
              }`
            }
            target="_blank"
            underline="none"
            color="inherit"
          >
            <StatusCell execution={recentExecutions} />
          </Link>
        );
      })}
    </div>
  );
}
