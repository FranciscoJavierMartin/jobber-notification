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
  public readonly SMTP_AUTH_USER: string;
  public readonly SMTP_AUTH_PASS: string;

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.CLIENT_URL = process.env.CLIENT_URL || '';
    this.RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT || '';
    this.SENDER_EMAIL = process.env.SENDER_EMAIL || '';
    this.SENDER_EMAIL_PASSWORD = process.env.SENDER_EMAIL_PASSWORD || '';
    this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || '';
    this.SERVER_PORT = +(process.env.SERVER_PORT || 4001);
    this.SMTP_HOST = process.env.SMTP_HOST || 'smtp.ethereal.email';
    this.SMTP_PORT = +(process.env.SMTP_PORT || 587);
    this.SMTP_AUTH_USER = process.env.SMTP_AUTH_USER || 'wilhelmine32@ethereal.email';
    this.SMTP_AUTH_PASS = process.env.SMTP_AUTH_PASS || 'CUareRxHnBwJzuhjJJ';
  }
}

export const config: Config = new Config();
