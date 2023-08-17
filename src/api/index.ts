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

const baseEndpoint = '/litmus';
const litmusApiEndpoint = baseEndpoint + '/api/query';

export interface LitmusApi {
  getExperimentRunStats(options: {
    projectID: string;
  }): Promise<ExperimentRunsStats | undefined>;
  getBasicStats(options: {
    projectID: string;
  }): Promise<BasicStats | undefined>;
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
      return (await response.json()) as T;
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
}
