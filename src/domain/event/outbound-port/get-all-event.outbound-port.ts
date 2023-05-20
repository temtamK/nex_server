import { Event } from '@prisma/client';

export type GetAllEventOutboundPortInputDto = void;

export type GetAllEventOutboundPortOutputDto = Event[];

export const GET_ALL_EVENT_OUTBOUND_PORT =
  'GET_ALL_EVENT_OUTBOUND_PORT' as const;

export interface GetAllEventOutboundPort {
  execute(
    params: GetAllEventOutboundPortInputDto,
  ): Promise<GetAllEventOutboundPortOutputDto>;
}
