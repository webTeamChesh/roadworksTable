
import { Client } from 'contensis-delivery-api';

const client = Client.create({
  rootUrl: `https://cms-${process.env.alias}.cloud.contensis.com`,
  accessToken: process.env.accessToken,
  projectId: process.env.projectId,
});

export const useClient = () => {
  return client;
};
