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
import {
  Avatar,
  Box,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Popper,
  Typography,
} from '@mui/material';
import { timeDifference } from '../../utils';

const useStyles = makeStyles(theme => ({
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
  popper: {
    zIndex: 1,
    '&[x-placement*="bottom"] $arrow': {
      top: 0,
      left: 0,
      marginTop: '-0.9em',
      width: '3em',
      height: '1em',
      '&::before': {
        borderWidth: '0 1em 1em 1em',
        borderColor: `transparent transparent ${theme.palette.background.paper} transparent`,
      },
    },
    '&[x-placement*="top"] $arrow': {
      bottom: 0,
      left: 0,
      marginBottom: '-0.9em',
      width: '3em',
      height: '1em',
      '&::before': {
        borderWidth: '1em 1em 0 1em',
        borderColor: `${theme.palette.background.paper} transparent transparent transparent`,
      },
    },
    '&[x-placement*="right"] $arrow': {
      left: 0,
      marginLeft: '-0.9em',
      height: '3em',
      width: '1em',
      '&::before': {
        borderWidth: '1em 1em 1em 0',
        borderColor: `transparent ${theme.palette.background.paper} transparent transparent`,
      },
    },
    '&[x-placement*="left"] $arrow': {
      right: 0,
      marginRight: '-0.9em',
      height: '3em',
      width: '1em',
      '&::before': {
        borderWidth: '1em 0 1em 1em',
        borderColor: `transparent transparent transparent ${theme.palette.background.paper}`,
      },
    },
  },
  paper: {
    width: '300px',
    maxWidth: 400,
    overflow: 'auto',
    backgroundColor: '#17293F',
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
      return <PauseIcon style={{ color: '#9d8ed6', fontSize: 12 }} />;
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

function StatusChip({ status }: StatusIcon): React.ReactElement {
  switch (status) {
    case ExperimentRunStatus.COMPLETED:
      return (
        <Chip
          icon={<CheckCircleIcon style={{ color: 'white' }} />}
          label="Complete"
          style={{ backgroundColor: '#1b841d', color: 'white' }}
        />
      );
    case ExperimentRunStatus.COMPLETED_WITH_PROBE_FAILURE:
    case ExperimentRunStatus.COMPLETED_WITH_ERROR: // <!-- needed for backwards compatibility -->
      return (
        <Chip
          label="Failure"
          icon={<ErrorIcon style={{ color: 'white' }} />}
          style={{ backgroundColor: '#ff832b', color: 'white' }}
        />
      );
    case ExperimentRunStatus.ERROR:
      return (
        <Chip
          icon={<CancelIcon style={{ color: 'white' }} />}
          label="Error"
          style={{ backgroundColor: '#da291d', color: 'white' }}
        />
      );
    case ExperimentRunStatus.TIMEOUT:
      return (
        <Chip
          icon={<AccessTimeIcon style={{ color: 'white' }} />}
          label="Timeout"
          style={{ backgroundColor: '#da291d', color: 'white' }}
        />
      );
    case ExperimentRunStatus.RUNNING:
      return (
        <Chip
          icon={<MoreHorizIcon style={{ color: 'black' }} />}
          label="Running"
          style={{ backgroundColor: '#ffffff', color: 'black' }}
        />
      );
    case ExperimentRunStatus.QUEUED:
      return (
        <Chip
          icon={<PauseIcon style={{ color: 'white' }} />}
          label="Queued"
          style={{ backgroundColor: '#9d8ed6', color: 'white' }}
        />
      );
    case ExperimentRunStatus.STOPPED:
      return (
        <Chip
          icon={<StopCircleOutlinedIcon style={{ color: 'white' }} />}
          label="Stopped"
          style={{ backgroundColor: '#383946', color: 'white' }}
        />
      );
    default:
      return (
        <Chip
          icon={<NotInterestedOutlinedIcon sx={{ color: 'white' }} />}
          label="N/A"
          style={{ backgroundColor: '#383946', color: 'white' }}
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
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    return (
      <div
        data-state={execution?.phase?.replace(/ /g, '_').toLowerCase()}
        className={classes.statusHeatMapCell}
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        {!hideIconForStatus(execution.phase) && (
          <div>
            <StatusIcon status={execution.phase} />
            <Popper
              id="mouse-over-popover"
              sx={{
                pointerEvents: 'none',
              }}
              open={open}
              anchorEl={anchorEl}
              className={classes.popper}
            >
              <Paper className={classes.paper}>
                <List sx={{ width: '100%', maxWidth: 300 }}>
                  <ListItem>
                    <Box sx={{ width: '45%' }}>
                      <ListItemText
                        primary={
                          <React.Fragment>
                            <Typography
                              sx={{ display: 'inline' }}
                              component="span"
                              variant="body2"
                              color="white"
                              display="inline"
                            >
                              Resilience Score:
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </Box>
                    <Box sx={{ width: '55%' }}>
                      <ListItemText
                        primary={
                          <React.Fragment>
                            <Typography
                              sx={{ display: 'inline' }}
                              component="span"
                              variant="h6"
                              color="#D24433"
                              display="inline"
                            >
                              {execution.resiliencyScore.toString() + ' '}
                            </Typography>
                            <Typography
                              sx={{ display: 'inline' }}
                              component="span"
                              variant="body2"
                              color="white"
                              display="inline"
                            >
                              / 100
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </Box>
                  </ListItem>
                  <ListItem>
                    <Box sx={{ width: '45%' }}>
                      <ListItemText
                        primary={
                          <React.Fragment>
                            <Typography
                              sx={{ display: 'inline' }}
                              component="span"
                              variant="body2"
                              color="white"
                              display="inline"
                            >
                              Status:
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </Box>
                    <Box sx={{ width: '55%' }}>
                      <StatusChip status={execution.phase} />
                    </Box>
                  </ListItem>
                  <ListItem>
                    <Box sx={{ width: '45%' }}>
                      <ListItemText
                        primary={
                          <React.Fragment>
                            <Typography
                              sx={{ display: 'inline' }}
                              component="span"
                              variant="body2"
                              color="white"
                              display="inline"
                            >
                              Executed by:
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </Box>
                    <ListItemAvatar>
                      <Avatar />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="white"
                            display="inline"
                          >
                            {execution.updatedBy.username}
                          </Typography>
                        </React.Fragment>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="caption"
                            fontSize="0.6rem"
                            color="white"
                          >
                            {timeDifference(
                              new Date().getTime(),
                              Number(execution.updatedAt),
                            )}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                </List>
              </Paper>
            </Popper>
          </div>
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
