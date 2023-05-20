import { Controller, Inject, Get } from '@nestjs/common';
import { GetAllEventInboundPort } from '../inbound-port/get-all-event.inbound-port';

@Controller('event')
export class EventContoller {
  constructor(
    @Inject('GET_ALL_EVENT_INBOUND_PORT')
    private readonly getAllEventInboundPort: GetAllEventInboundPort,
  ) {}

  @Get()
  getAllEvent() {
    return this.getAllEventInboundPort.execute();
  }
}
