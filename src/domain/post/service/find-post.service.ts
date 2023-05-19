import { Inject } from '@nestjs/common';
import { FindPostOutboundPort } from '../outbound-port/find-post.outbound-port';

export class FindPostService {
  constructor(
    @Inject()
    private findPostOutboundPort: FindPostOutboundPort,
  ) {}
  async execute(parmas) {
    return this.findPostOutboundPort.execute(parmas);
  }
}
