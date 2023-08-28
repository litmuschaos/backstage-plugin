import { InfoCard } from '@backstage/core-components';
import {
  List,
  Link,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@material-ui/core';
import React, { ReactNode } from 'react';
import ScienceIcon from '@mui/icons-material/Science';
import LogoDevIcon from '@mui/icons-material/LogoDev';
import ArticleIcon from '@mui/icons-material/Article';
import PeopleIcon from '@mui/icons-material/People';
import { useStyles } from './styles';

const litmusAPIDocsURL =
  'https://litmuschaos.github.io/litmus/graphql/v2.9.0/api.html';
const litmusDocsURL = 'https://docs.litmuschaos.io/';
const litmusExperimentDocsURL = 'https://litmuschaos.github.io/litmus/';
const litmusCommunityURL = 'https://slack.litmuschaos.io/';

const DevInfoItem = ({
  icon,
  link,
  title,
}: {
  icon: ReactNode;
  link: string;
  title: string;
}) => {
  return (
    <Link href={link} target="_blank" underline="none" color="inherit">
      <ListItem button>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={title} />
      </ListItem>
    </Link>
  );
};

export const DevInfoCard = () => {
  const classes = useStyles();

  return (
    <InfoCard title="Dev Info" className={classes.gridItemCard}>
      <List component="nav" aria-label="mailbox folders">
        <DevInfoItem
          icon={<ScienceIcon />}
          link={litmusExperimentDocsURL}
          title="Experiment Docs"
        />
        <Divider light />
        <DevInfoItem
          icon={<LogoDevIcon />}
          link={litmusAPIDocsURL}
          title="Litmus API Docs"
        />
        <Divider light />
        <DevInfoItem
          icon={<ArticleIcon />}
          link={litmusDocsURL}
          title="Litmus Docs"
        />
        <Divider light />
        <DevInfoItem
          icon={<PeopleIcon />}
          link={litmusCommunityURL}
          title="Litmus Community"
        />
      </List>
    </InfoCard>
  );
};
