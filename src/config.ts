import dotenv from 'dotenv';

dotenv.config({});

class Config {
  public readonly NODE_ENV: string;
  public readonly CLIENT_URL: string;
  public readonly RABBITMQ_ENDPOINT: string;
  public readonly SENDER_EMAIL: string;
  public readonly SENDER_EMAIL_PASSWORD: string;
  public readonly ELASTIC_SEARCH_URL: string;
  public readonly SERVER_PORT: number;
  public readonly SMTP_HOST: string;
  public readonly SMTP_PORT: number;

  constructor() {
    this.NODE_ENV = process.env.NOTIFICATION_NODE_ENV || '';
    this.CLIENT_URL = process.env.NOTIFICATION_CLIENT_URL || '';
    this.RABBITMQ_ENDPOINT = process.env.NOTIFICATION_RABBITMQ_ENDPOINT || '';
    this.ELASTIC_SEARCH_URL = process.env.NOTIFICATION_ELASTIC_SEARCH_URL || '';
    this.SERVER_PORT = 4001;
    this.SMTP_HOST = process.env.NOTIFICATION_SMTP_HOST || '';
    this.SMTP_PORT = +(process.env.NOTIFICATION_SMTP_PORT || 0);
    this.SENDER_EMAIL = process.env.NOTIFICATION_SENDER_EMAIL || '';
    this.SENDER_EMAIL_PASSWORD = process.env.NOTIFICATION_SENDER_EMAIL_PASSWORD || '';
  }
}

export const config: Config = new Config();
