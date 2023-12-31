export type ExperimentRunsStats = {
  totalExperimentRuns: number;
  totalRunningExperimentRuns: number;
  totalCompletedExperimentRuns: number;
  totalTerminatedExperimentRuns: number;
  totalStoppedExperimentRuns: number;
  totalErroredExperimentRuns: number;
};

export type GetExperimentRunsStatsResponse = {
  data: {
    getExperimentRunStats: ExperimentRunsStats;
  };
};
