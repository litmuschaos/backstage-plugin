import { Entity } from '@backstage/catalog-model';
import jwtDecode from 'jwt-decode';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { DecodedTokenType } from '../types/DecodedTokenType';

export const LITMUS_PROJECT_ID = 'litmuschaos.io/project-id';

export const useLitmusAppData = ({ entity }: { entity: Entity }) => {
  const projectID = entity?.metadata.annotations?.[LITMUS_PROJECT_ID] ?? '';
  const configApi = useApi(configApiRef);
  const accountID = (
    jwtDecode(configApi.getString('litmus.apiToken')) as DecodedTokenType
  ).uid;

  if (!projectID) {
    throw new Error("'Litmus' annotations are missing");
  }

  if (!accountID) {
    throw new Error("'Litmus' apiToken is missing");
  }

  return { projectID, accountID };
};
