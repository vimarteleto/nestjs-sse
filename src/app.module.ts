import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [ReportsModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
