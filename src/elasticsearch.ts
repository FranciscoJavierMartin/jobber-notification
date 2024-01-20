import { Client } from '@elastic/elasticsearch';
import { winstonLogger } from '@franciscojaviermartin/jobber-shared';
import { Logger } from 'winston';
import { config } from '@notifications/config';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';

const log: Logger = winstonLogger(
  config.ELASTIC_SEARCH_URL,
  'notificationElasticSearchServer',
  'debug'
);
const elasticSearchClient = new Client({
  node: config.ELASTIC_SEARCH_URL,
});

export async function checkConnection(): Promise<void> {
  let isConnected: boolean = false;

  while (!isConnected) {
    try {
      const health: ClusterHealthResponse =
        await elasticSearchClient.cluster.health({});
      log.info(
        `NotificationService ElasticSearch health status - ${health.status}`
      );
      isConnected = true;
    } catch (error) {
      log.error('Connection to ElasticSearch failed. Retrying...');
      log.log('error', 'NotificationService: checkConnection() method:', error);
    }
  }
}
