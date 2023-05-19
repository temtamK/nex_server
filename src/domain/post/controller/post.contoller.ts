import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  FindPostInboundPort,
  FindPostInboundPortInputDto,
} from '../inbound-port/find-post.inbound-port';

@Controller('post')
export class PostController {
  constructor(
    @Inject('FIND_POST_INBOUND_PORT')
    private findPostInboundPort: FindPostInboundPort,
  ) {}

  @Get()
  find(@Query() query: FindPostInboundPortInputDto) {
    if (query.model == 'user' || query.model == 'channel') {
      return this.findPostInboundPort.execute(query);
    } else {
      throw new BadRequestException('Invalid model', {
        cause: new Error(),
        description:
          'The values of the model are only available for channel and user',
      });
    }
  }

  @Post()
  create(@Param() params: CreatePostInboundPortInputDto) {
    return this.createPostInboundPort.execute(params);
  }
}
