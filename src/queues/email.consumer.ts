import { Channel, ConsumeMessage } from 'amqplib';
import { Logger } from 'winston';
import { winstonLogger } from '@franciscojaviermartin/jobber-shared';
import { config } from '@notifications/config';
import { createConnection } from '@notifications/queues/connection';

const log: Logger = winstonLogger(
  config.ELASTIC_SEARCH_URL,
  'emailConsumer',
  'debug'
);

export const exchangeName = 'jobber-email-notification';
export const routingKey = 'auth-email';

export async function consumeAuthEmailMessages(channel: Channel) {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }

    const queueName = 'auth-email-queue';
    await channel.assertExchange(exchangeName, 'direct');
    const jobberQueue = await channel.assertQueue(queueName, {
      durable: true,
      autoDelete: false,
    });
    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);
    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      console.log(JSON.parse(msg!.content.toString()));
    });
  } catch (error) {
    log.log(
      'error',
      'NotificationService EmailConsumer consumeAuthEmailMessages() method error:',
      error
    );
  }
}
