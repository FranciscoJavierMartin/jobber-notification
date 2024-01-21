import { Logger } from 'winston';
import {
  IEmailLocals,
  winstonLogger,
} from '@franciscojaviermartin/jobber-shared';
import { config } from '@notifications/config';
import { emailTemplates } from '@notifications/helpers';

const log: Logger = winstonLogger(
  config.ELASTIC_SEARCH_URL,
  'mailTransport',
  'debug'
);

export async function sendEmail(
  template: string,
  receiverEmail: string,
  locals: IEmailLocals
) {
  try {
    emailTemplates(template, receiverEmail, locals);
    log.info('Email sent successfully');
  } catch (error) {
    log.log(
      'error',
      'NotificationService MailTransport sendEmail() method error:',
      error
    );
  }
}
