export const getEnvironmentsQuery = `
query listEnvironments($projectID: ID!, $request: ListEnvironmentRequest!) {
    listEnvironments(request: $request, projectID: $projectID) {
      environments {
        environmentID
        name
        tags
        type
        infraIDs
        isRemoved
      }
    }
  }
`;
