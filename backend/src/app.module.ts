import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactsModule } from './contacts/contacts.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { configProvider } from './app.config.provider';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    ContactsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [configProvider, AppService],
  exports: [configProvider],
})
export class AppModule {}
