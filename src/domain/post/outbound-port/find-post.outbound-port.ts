import { Post } from '@prisma/client';

export type FindPostOutboundPortInputDto = {
  model: string;
  id: string;
};

export type FindPostOutboundPortOutputDto = {
  posts: Post[];
};

export const FIND_POST_OUTBOUND_PORT = 'FIND_POST_OUTBOUND_PORT' as const;

export interface FindPostOutboundPort {
  execute(
    params: FindPostOutboundPortInputDto,
  ): Promise<FindPostOutboundPortOutputDto>;
}
