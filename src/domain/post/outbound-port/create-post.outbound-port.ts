import { Post } from '@prisma/client';

export type CreatePostOutboundPortInputDto = Post;

export type CreatePostOutboundPortOutputDto = void;

export const CREATE_POST_OUTBOUND_PORT = 'CREATE_POST_OUTBOUND_PORT' as const;

export interface CreatePostOutboundPort {
  execute(
    params: CreatePostOutboundPortInputDto,
  ): Promise<CreatePostOutboundPortOutputDto>;
}
