export const getBasicStatsQuery = `
query getBasicStats($projectID: ID!) {
  getExperimentStats(projectID: $projectID) {
    totalExperiments
  }
  getChaosHubStats(projectID: $projectID) {
    totalChaosHubs
  }
  getInfraStats(projectID: $projectID) {
    totalActiveInfrastructure
  }
  getGitOpsDetails(projectID: $projectID){
    enabled
  }
}
`;
