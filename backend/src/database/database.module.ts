import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): DataSourceOptions => {
        const host = config.get<string>('POSTGRES_HOST');
        const port = config.get<number>('POSTGRES_PORT');
        const username = config.get<string>('POSTGRES_USERNAME');
        const password = config.get<string>('POSTGRES_PASSWORD');
        const database = config.get<string>('POSTGRES_DB');

        // console.log('Database Config:', { host, port, username, password, database });

        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: config.get<boolean>('POSTGRES_SYNC') || false,
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
