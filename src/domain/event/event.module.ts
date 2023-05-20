import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { GetAllEventOutboundRepository } from './outbound-adapter/get-all-event.repository';
import { GetAllEventService } from './service/get-all-event.service';

@Module({
  imports: [],
  controllers: [EventContoller],
  providers: [
    PrismaService
    {
      provide: 'GET_ALL_EVENT_INBOUND_PORT',
      useClass: GetAllEventService,
    },
    {
      provide: 'GET_ALL_EVENT_OUTBOUND_PORT',
      useClass: GetAllEventRepository,
    },
  ],
})
export class EventModule {}
