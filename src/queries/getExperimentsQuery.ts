export const getExperimentsQuery = `
query listExperiment($projectID: ID!, $request: ListExperimentRequest!) {
  listExperiment(projectID: $projectID, request: $request) {
    experiments {
      experimentID
      cronSyntax
      infra {
        infraID
        infraType
        name
        environmentID
        infraNamespace
        infraScope
        isActive
      }
      experimentType
      name
      recentExperimentRunDetails {
        experimentRunID
        phase
        resiliencyScore
      }
    }
  }
}
`;
