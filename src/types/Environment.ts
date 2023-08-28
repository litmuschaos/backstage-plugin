export type Environment = {
  environmentID: string;
  name: string;
  tags: string[];
  type: string;
  infraIDs: string[];
  isRemoved: boolean;
};

export type GetEnvironmentsResponse = {
  data: {
    listEnvironments: {
      environments: Environment[];
    };
  };
};

export function responseToEnvironments(
  response: GetEnvironmentsResponse | undefined,
) {
  return response?.data.listEnvironments.environments;
}
