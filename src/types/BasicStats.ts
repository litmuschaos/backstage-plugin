export type BasicStats = {
  gitOps: boolean;
  totalInfrastructure: number;
  totalExperiments: number;
  totalChaosHubs: number;
};

export function responseToBasicStats(
  response: GetBasicStatsResponse | undefined,
): BasicStats {
  return {
    gitOps: response?.data.getGitOpsDetails.enabled ?? false,
    totalInfrastructure:
      response?.data.getInfraStats.totalActiveInfrastructure ?? 0,
    totalExperiments: response?.data.getExperimentStats.totalExperiments ?? 0,
    totalChaosHubs: response?.data.getChaosHubStats.totalChaosHubs ?? 0,
  };
}

export type GetBasicStatsResponse = {
  data: {
    getGitOpsDetails: {
      enabled: boolean;
    };
    getInfraStats: {
      totalActiveInfrastructure: number;
    };
    getExperimentStats: {
      totalExperiments: number;
    };
    getChaosHubStats: {
      totalChaosHubs: number;
    };
  };
};
