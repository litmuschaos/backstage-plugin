export const getExperimentRunStatsQuery = `
query getExperimentRunStats($projectID: ID!) {
  getExperimentRunStats(projectID: $projectID) {
    totalExperimentRuns
    totalRunningExperimentRuns
    totalCompletedExperimentRuns
    totalTerminatedExperimentRuns
    totalStoppedExperimentRuns
    totalErroredExperimentRuns
  }
}
`;
