import * as path from 'path';

import nodemailer from 'nodemailer';
import { Logger } from 'winston';
import {
  IEmailLocals,
  winstonLogger,
} from '@franciscojaviermartin/jobber-shared';
import { config } from '@notifications/config';
import Email from 'email-templates';

const log: Logger = winstonLogger(
  config.ELASTIC_SEARCH_URL,
  'mailTransportHelper',
  'debug'
);

export async function emailTemplates(
  template: string,
  receiver: string,
  locals: IEmailLocals
): Promise<void> {
  try {
    const transport = nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      auth: {
        user: config.SENDER_EMAIL,
        pass: config.SENDER_EMAIL_PASSWORD,
      },
    });
    const email: Email = new Email({
      message: {
        from: `Jobber App <${config.SENDER_EMAIL}>`,
      },
      send: true,
      preview: false,
      transport,
      views: {
        options: {
          extension: 'ejs',
        },
      },
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, '../build'),
        },
      },
    });

    await email.send({
      template: path.join(__dirname, '../src/emails', template),
      message: { to: receiver },
      locals,
    });
  } catch (error) {
    log.error(error);
  }
}
