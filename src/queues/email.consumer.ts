import { Channel, ConsumeMessage } from 'amqplib';
import { Logger } from 'winston';
import {
  IEmailLocals,
  winstonLogger,
} from '@franciscojaviermartin/jobber-shared';
import { config } from '@notifications/config';
import { createConnection } from '@notifications/queues/connection';
import { sendEmail } from '@notifications/queues/mail.transport';

const log: Logger = winstonLogger(
  config.ELASTIC_SEARCH_URL,
  'emailConsumer',
  'debug'
);

export const exchangeAuthName = 'jobber-auth-notification';
export const exchangeOrderName = 'jobber-order-notification';
export const routingAuthKey = 'auth-email';
export const routingOrderKey = 'order-email';

export async function consumeAuthEmailMessages(channel: Channel) {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }

    const queueName = 'auth-email-queue';
    await channel.assertExchange(exchangeAuthName, 'direct');
    const jobberQueue = await channel.assertQueue(queueName, {
      durable: true,
      autoDelete: false,
    });
    await channel.bindQueue(
      jobberQueue.queue,
      exchangeAuthName,
      routingAuthKey
    );
    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      const { receiverEmail, username, verifyLink, resetLink, template } =
        JSON.parse(msg!.content.toString());
      const locals: IEmailLocals = {
        appLink: config.CLIENT_URL,
        appIcon: 'https://i.ibb.co/Kyp2m0t/cover.png',
        username,
        verifyLink,
        resetLink,
      };
      await sendEmail(template, receiverEmail, locals);
      channel.ack(msg!);
    });
  } catch (error) {
    log.log(
      'error',
      'NotificationService EmailConsumer consumeAuthEmailMessages() method error:',
      error
    );
  }
}

export async function consumeOrderEmailMessages(channel: Channel) {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }

    const queueName = 'order-email-queue';
    await channel.assertExchange(exchangeOrderName, 'direct');
    const jobberQueue = await channel.assertQueue(queueName, {
      durable: true,
      autoDelete: false,
    });
    await channel.bindQueue(
      jobberQueue.queue,
      exchangeOrderName,
      routingOrderKey
    );
    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      console.log(JSON.parse(msg!.content.toString()));
    });
  } catch (error) {
    log.log(
      'error',
      'NotificationService EmailConsumer consumeOrderEmailMessages() method error:',
      error
    );
  }
}
