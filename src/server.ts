import 'express-async-errors';
import http from 'http';

import { Application } from 'express';
import { Logger } from 'winston';
import { Channel } from 'amqplib';
import { winstonLogger } from '@franciscojaviermartin/jobber-shared';
import { config } from '@notifications/config';
import { healthRoutes } from '@notifications/routes';
import { checkConnection } from '@notifications/elasticsearch';
import { createConnection } from '@notifications/queues/connection';
import {
  consumeAuthEmailMessages,
  consumeOrderEmailMessages,
  exchangeAuthName,
  exchangeOrderName,
  routingAuthKey,
  routingOrderKey,
} from '@notifications/queues/email.consumer';

const SERVER_PORT: number = config.SERVER_PORT;

const log: Logger = winstonLogger(
  config.ELASTIC_SEARCH_URL,
  'notificationServer',
  'debug'
);

export function start(app: Application): void {
  startServer(app);
  app.use('', healthRoutes);
  startQueues();
  startElasticSearch();
}

async function startQueues(): Promise<void> {
  const emailChannel: Channel = (await createConnection())!;
  await consumeAuthEmailMessages(emailChannel);
  await consumeOrderEmailMessages(emailChannel);

  await emailChannel.assertExchange(exchangeAuthName, 'direct');
  const messageAuth = JSON.stringify({
    name: 'jobber',
    service: 'notification service',
  });
  emailChannel.publish(
    exchangeAuthName,
    routingAuthKey,
    Buffer.from(messageAuth)
  );

  await emailChannel.assertExchange(exchangeOrderName, 'direct');
  const messageOrder = JSON.stringify({
    name: 'jobber',
    service: 'notification service',
  });
  emailChannel.publish(
    exchangeOrderName,
    routingOrderKey,
    Buffer.from(messageOrder)
  );
}

function startElasticSearch(): void {
  checkConnection();
}

function startServer(app: Application): void {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(
      `Worker with process id ${process.pid} on notification server has started`
    );
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Notification server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'NotificationService startServer() method:', error);
  }
}
