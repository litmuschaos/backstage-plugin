// https://backstage.io/docs/conf/defining/
export interface Config {
  litmus: {
    /**
     * The api token of the litmus instance.
     * @visibility frontend
     */
    apiToken: string;

    /**
     * Frontend root URL
     * @visibility frontend
     */
    baseUrl: string;
  };
}
