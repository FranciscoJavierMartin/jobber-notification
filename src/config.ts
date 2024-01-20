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

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.CLIENT_URL = process.env.CLIENT_URL || '';
    this.RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT || '';
    this.SENDER_EMAIL = process.env.SENDER_EMAIL || '';
    this.SENDER_EMAIL_PASSWORD = process.env.SENDER_EMAIL_PASSWORD || '';
    this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || '';
    this.SERVER_PORT = +process.env.SERVER_PORT! || 4001;
  }
}

export const config: Config = new Config();
