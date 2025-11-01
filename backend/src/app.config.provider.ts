import { ConfigModule } from '@nestjs/config';

export interface AppConfigDatabase {
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface AppConfig {
  database: AppConfigDatabase;
}

const applicationConfig: AppConfigDatabase = {
  type: 'postgres',
  host: String(process.env.DATABASE_HOST),
  port: parseInt(String(process.env.DATABASE_PORT), 10),
  username: String(process.env.DATABASE_USERNAME),
  password: String(process.env.DATABASE_PASSWORD),
  database: String(process.env.DATABASE_NAME),
};

export const configProvider = {
  imports: [ConfigModule.forRoot()],
  provide: 'CONFIG',
  useValue: <AppConfig>{
    database: applicationConfig,
  },
};
