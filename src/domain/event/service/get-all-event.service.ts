import { Inject } from '@nestjs/common';
import {
  GetAllEventInboundPort,
  GetAllEventInboundPortInputDto,
  GetAllEventInboundPortOutputDto,
} from '../inbound-port/get-all-event.inbound-port';
import {
  GetAllEventOutboundPort,
  GET_ALL_EVENT_OUTBOUND_PORT,
} from '../outbound-port/get-all-event.outbound-port';

export class GetAllEventService implements GetAllEventInboundPort {
  constructor(
    @Inject(GET_ALL_EVENT_OUTBOUND_PORT)
    private readonly getAllEventOutboundPort: GetAllEventOutboundPort,
  ) {}

  async execute(
    params: GetAllEventInboundPortInputDto,
  ): Promise<GetAllEventInboundPortOutputDto> {
    return this.getAllEventOutboundPort.execute();
  }
}
