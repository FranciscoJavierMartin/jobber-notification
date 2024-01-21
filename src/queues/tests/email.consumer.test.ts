import * as connection from '@notifications/queues/connection';
import {
  consumeAuthEmailMessages,
  exchangeAuthName,
  queueAuthName,
  routingAuthKey,
} from '@notifications/queues/email.consumer';
import amqp from 'amqplib';

jest.mock('@notifications/queues/connection');
jest.mock('amqplib');
jest.mock('@franciscojaviermartin/jobber-shared');

describe('Email consumer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('consumeAuthEmailMessages', () => {
    it('should be called', async () => {
      const channel = {
        assertExchange: jest.fn(),
        publish: jest.fn(),
        assertQueue: jest.fn(),
        bindQueue: jest.fn(),
        consume: jest.fn(),
      };
      jest.spyOn(channel, 'assertExchange');
      jest.spyOn(channel, 'assertQueue').mockReturnValue({
        queue: queueAuthName,
        messageCount: 0,
        consumerCount: 0,
      });
      jest
        .spyOn(connection, 'createConnection')
        .mockReturnValue(channel as never);
      const connectionChannel: amqp.Channel | undefined =
        await connection.createConnection();
      await consumeAuthEmailMessages(connectionChannel!);
      expect(connectionChannel?.assertExchange).toHaveBeenCalledWith(
        exchangeAuthName,
        'direct'
      );
      expect(connectionChannel?.assertQueue).toHaveBeenCalledTimes(1);
      expect(connectionChannel?.consume).toHaveBeenCalledTimes(1);
      expect(connectionChannel?.bindQueue).toHaveBeenCalledWith(
        queueAuthName,
        exchangeAuthName,
        routingAuthKey
      );
    });
  });
});
