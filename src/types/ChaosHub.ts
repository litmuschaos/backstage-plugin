export type ChaosHub = {
  id: string;
  isAvailable: boolean;
  totalFaults: number;
  totalExperiments: number;
  name: string;
};

export type GetChaosHubsResponse = {
  data: {
    listChaosHub: ChaosHub[];
  };
};

export function responseToChaosHubs(
  response: GetChaosHubsResponse | undefined,
) {
  return response?.data.listChaosHub;
}
