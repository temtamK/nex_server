import { Post } from '@prisma/client';

export type FindPostInboundPortInputDto = {
  model: string;
  id: string;
};

export type FindPostInboundPortOutputDto = {
  posts: Post[];
};

export const FIND_POST_INBOUND_PORT = 'FIND_POST_INBOUND_PORT' as const;

export interface FindPostInboundPort {
  execute(
    inputDto: FindPostInboundPortInputDto,
  ): Promise<FindPostInboundPortOutputDto>;
}
