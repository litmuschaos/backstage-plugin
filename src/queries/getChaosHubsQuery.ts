export const getChaosHubsQuery = `
query listChaosHub($projectID: ID!, $request: ListChaosHubRequest!) {
    listChaosHub(projectID: $projectID, request: $request) {
      id
      isAvailable
      totalFaults
      totalExperiments
      name
    }
  }
`;
