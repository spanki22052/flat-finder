import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { ApartmentsModule } from './modules/apartments/apartments.module.js';
import { ContactsModule } from './modules/contacts/contacts.module.js';
import { CallsModule } from './modules/calls/calls.module.js';
import { RemindersModule } from './modules/reminders/reminders.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ApartmentsModule,
    ContactsModule,
    CallsModule,
    RemindersModule,
  ],
})
export class AppModule {}
