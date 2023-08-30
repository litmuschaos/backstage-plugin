export type Experiment = {
  experimentID: string;
  cronSyntax: string;
  infra: {
    infraID: string;
    infraType: string;
    name: string;
    environmentID: string;
    infraNamespace: string;
    infraScope: string;
    isActive: boolean;
  };
  experimentType: string;
  name: string;
  recentExperimentRunDetails: RecentExecutions[];
};

export type GetExperimentsResponse = {
  data: {
    listExperiment: {
      experiments: Experiment[];
    };
  };
};

export interface UserDetails {
  userID: string;
  username: string;
  email: string;
}

// Experiment Run Status
export enum ExperimentRunStatus {
  COMPLETED = 'Completed',
  /**
   * @deprecated Use COMPLETED_WITH_PROBE_FAILURE instead.
   */
  COMPLETED_WITH_ERROR = 'Completed_With_Error',
  COMPLETED_WITH_PROBE_FAILURE = 'Completed_With_Probe_Failure',
  ERROR = 'Error',
  RUNNING = 'Running',
  STOPPED = 'Stopped',
  TIMEOUT = 'Timeout',
  QUEUED = 'Queued',
  NA = 'NA', // <!-- needed for default -->
}

export type RecentExecutions = {
  experimentRunID: string;
  resilienceScore: number | undefined;
  phase: ExperimentRunStatus;
};

export function responseToExperiments(
  response: GetExperimentsResponse | undefined,
) {
  return response?.data.listExperiment.experiments;
}
