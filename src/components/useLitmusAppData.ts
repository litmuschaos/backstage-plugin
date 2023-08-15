import { Entity } from '@backstage/catalog-model';

export const LITMUS_PROJECT_ID = 'litmuschaos.io/project-id';

export const useLitmusAppData = ({ entity }: { entity: Entity }) => {
  const projectID = entity?.metadata.annotations?.[LITMUS_PROJECT_ID] ?? '';

  if (!projectID) {
    throw new Error("'Litmus' annotations are missing");
  }
  return { projectID };
};
