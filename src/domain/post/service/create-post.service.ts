import { Inject } from '@nestjs/common';
import { CreatePostOutboundPort } from '../outbound-port/create-post.outbound-port';

export class CreatePostService {
  constructor(
    @Inject()
    private createPostOutboundPort: CreatePostOutboundPort,
  ) {}
  async execute(parmas) {
    return this.createPostOutboundPort.execute(parmas);
  }
}
