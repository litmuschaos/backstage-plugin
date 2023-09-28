export const runChaosExperimentQuery = `
mutation runChaosExperiment($projectID: ID!, $experimentID: String!) {
    runChaosExperiment(experimentID: $experimentID, projectID: $projectID) {
      notifyID
    }
}
`;
