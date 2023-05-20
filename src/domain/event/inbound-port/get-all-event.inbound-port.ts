import { Event } from '@prisma/client';

export type GetAllEventInboundPortInputDto = void;

export type GetAllEventInboundPortOutputDto = Event[];

export const GET_ALL_EVENT_INBOUND_PORT = 'GET_ALL_EVENT_INBOUND_PORT' as const;

export interface GetAllEventInboundPort {
  execute(
    params: GetAllEventInboundPortInputDto,
  ): Promise<GetAllEventInboundPortOutputDto>;
}
