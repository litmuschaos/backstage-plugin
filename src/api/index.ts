import {
  DiscoveryApi,
  FetchApi,
  createApiRef,
} from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import { ExperimentRunsStats } from '../types/ExperimentsRunStats';
import { getExperimentRunStatsQuery } from '../queries/getExperimentRunStatsQuery';

const baseEndpoint = '/litmus';
const litmusApiEndpoint = baseEndpoint + '/api';

export interface LitmusApi {
  getExperimentRunStats(options: {
    projectID: string;
  }): Promise<ExperimentRunsStats | undefined>;
}

export const litmusApiRef = createApiRef<LitmusApi>({
  id: 'plugin.litmus.service',
});

export type Options = {
  discoveryApi: DiscoveryApi;
  fetchApi: FetchApi;
  apiToken: string;
};

export class LitmusApiClient implements LitmusApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;
  private readonly apiToken: string;

  constructor(options: Options) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
    this.apiToken = options.apiToken;
  }

  private async callApi<T>(
    endpoint: string,
    requestOptions: RequestInit,
  ): Promise<T | undefined> {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.apiToken);
    requestOptions.headers = headers;

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

    return await this.callApi<ExperimentRunsStats>(
      litmusApiEndpoint,
      requestOptions,
    );
  }
}
