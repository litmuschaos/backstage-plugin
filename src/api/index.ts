import {
  DiscoveryApi,
  FetchApi,
  createApiRef,
} from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import {
  ExperimentRunsStats,
  GetExperimentRunsStatsResponse,
} from '../types/ExperimentsRunStats';
import { getExperimentRunStatsQuery } from '../queries/getExperimentRunStatsQuery';
import {
  BasicStats,
  GetBasicStatsResponse,
  responseToBasicStats,
} from '../types/BasicStats';
import { getBasicStatsQuery } from '../queries/getBasicStatsQuery';
import {
  ChaosHub,
  GetChaosHubsResponse,
  responseToChaosHubs,
} from '../types/ChaosHub';
import { getChaosHubsQuery } from '../queries/getChaosHubsQuery';
import {
  Environment,
  GetEnvironmentsResponse,
  responseToEnvironments,
} from '../types/Environment';
import { getEnvironmentsQuery } from '../queries/getEnvironmentsQueryt';
import {
  Experiment,
  GetExperimentsResponse,
  responseToExperiments,
} from '../types/Experiment';
import { getExperimentsQuery } from '../queries/getExperimentsQuery';
import { runChaosExperimentQuery } from '../queries/runChaosExperimentQuery';

const baseEndpoint = '/litmus';
const litmusApiEndpoint = baseEndpoint + '/api/query';

export interface LitmusApi {
  getExperimentRunStats(options: {
    projectID: string;
  }): Promise<ExperimentRunsStats | undefined>;
  getBasicStats(options: {
    projectID: string;
  }): Promise<BasicStats | undefined>;
  getChaosHubs(options: { projectID: string }): Promise<ChaosHub[] | undefined>;
  getEnvironments(options: {
    projectID: string;
  }): Promise<Environment[] | undefined>;
  getExperiments(options: {
    projectID: string;
  }): Promise<Experiment[] | undefined>;
  runChaosExperiment(options: {
    experimentID: string;
    projectID: string;
  }): Promise<void | undefined>;
}

export const litmusApiRef = createApiRef<LitmusApi>({
  id: 'plugin.litmus.service',
});

export type Options = {
  discoveryApi: DiscoveryApi;
  fetchApi: FetchApi;
};

export class LitmusApiClient implements LitmusApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;

  constructor(options: Options) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
  }

  private async callApi<T>(
    endpoint: string,
    requestOptions: RequestInit,
  ): Promise<T | undefined> {
    requestOptions.headers = new Headers({
      'Content-Type': 'application/json',
    });

    const apiUrl = `${
      (await this.discoveryApi.getBaseUrl('proxy')) + endpoint
    }`;
    const response = await this.fetchApi.fetch(apiUrl, requestOptions);
    if (response.status === 200) {
      const json = await response.json();
      if (json.errors) {
        throw new Error(json.errors[0].message);
      }
      return json as T;
    }
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    } else {
      return undefined;
    }
  }

  async getExperimentRunStats(options: {
    projectID: string;
  }): Promise<ExperimentRunsStats | undefined> {
    const requestOptions: RequestInit = {
      method: 'POST',
      body: JSON.stringify({
        query: getExperimentRunStatsQuery,
        variables: {
          projectID: options.projectID,
        },
      }),
      redirect: 'follow',
    };

    const response = await this.callApi<GetExperimentRunsStatsResponse>(
      litmusApiEndpoint,
      requestOptions,
    );
    return response?.data.getExperimentRunStats;
  }

  async getBasicStats(options: {
    projectID: string;
  }): Promise<BasicStats | undefined> {
    const requestOptions: RequestInit = {
      method: 'POST',
      body: JSON.stringify({
        query: getBasicStatsQuery,
        variables: {
          projectID: options.projectID,
        },
      }),
      redirect: 'follow',
    };

    const response = await this.callApi<GetBasicStatsResponse>(
      litmusApiEndpoint,
      requestOptions,
    );

    return responseToBasicStats(response);
  }

  async getChaosHubs(options: {
    projectID: string;
  }): Promise<ChaosHub[] | undefined> {
    const requestOptions: RequestInit = {
      method: 'POST',
      body: JSON.stringify({
        query: getChaosHubsQuery,
        variables: {
          projectID: options.projectID,
          request: {},
        },
      }),
      redirect: 'follow',
    };

    const response = await this.callApi<GetChaosHubsResponse>(
      litmusApiEndpoint,
      requestOptions,
    );

    return responseToChaosHubs(response);
  }

  async getEnvironments(options: {
    projectID: string;
  }): Promise<Environment[] | undefined> {
    const requestOptions: RequestInit = {
      method: 'POST',
      body: JSON.stringify({
        query: getEnvironmentsQuery,
        variables: {
          projectID: options.projectID,
          request: {},
        },
      }),
      redirect: 'follow',
    };

    const response = await this.callApi<GetEnvironmentsResponse>(
      litmusApiEndpoint,
      requestOptions,
    );

    return responseToEnvironments(response);
  }

  async getExperiments(options: {
    projectID: string;
  }): Promise<Experiment[] | undefined> {
    const requestOptions: RequestInit = {
      method: 'POST',
      body: JSON.stringify({
        query: getExperimentsQuery,
        variables: {
          projectID: options.projectID,
          request: {},
        },
      }),
      redirect: 'follow',
    };

    const response = await this.callApi<GetExperimentsResponse>(
      litmusApiEndpoint,
      requestOptions,
    );

    return responseToExperiments(response);
  }

  async runChaosExperiment(options: {
    experimentID: string;
    projectID: string;
  }): Promise<void | undefined> {
    const requestOptions: RequestInit = {
      method: 'POST',
      body: JSON.stringify({
        query: runChaosExperimentQuery,
        variables: {
          projectID: options.projectID,
          experimentID: options.experimentID,
          request: {},
        },
      }),
      redirect: 'follow',
    };

    await this.callApi<GetExperimentsResponse>(
      litmusApiEndpoint,
      requestOptions,
    );
  }
}
