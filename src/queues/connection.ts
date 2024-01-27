import { winstonLogger } from '@franciscojaviermartin/jobber-shared';
import { config } from '@notifications/config';
import client, { Channel, Connection } from 'amqplib';
import { Logger } from 'winston';

const log: Logger = winstonLogger(
  config.ELASTIC_SEARCH_URL,
  'notificationQueueConnection',
  'debug'
);

export async function createConnection(): Promise<Channel | undefined> {
  let channel: Channel | undefined;

  try {
    const connection: Connection = await client.connect(
      config.RABBITMQ_ENDPOINT
    );
    channel = await connection.createChannel();
    log.info('Notification server connected to queue successfully...');
    closeConnection(channel, connection);
  } catch (error) {
    log.error(
      'error',
      'NotificationService error createConnection() method:',
      error
    );
    channel = undefined;
  }

  return channel;
}

function closeConnection(channel: Channel, connection: Connection): void {
  process.once('SIGINT', async () => {
    await channel.close();
    await connection.close();
  });
}
