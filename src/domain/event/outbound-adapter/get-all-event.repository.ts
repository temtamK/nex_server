import { Inject } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
  GetAllEventOutboundPort,
  GetAllEventOutboundPortInputDto,
  GetAllEventOutboundPortOutputDto,
} from '../outbound-port/get-all-event.outbound-port';

export class GetAllEventRepository implements GetAllEventOutboundPort {
  constructor(
    @Inject('PrismaService')
    private readonly prisma: PrismaService,
  ) {}

  async execute(
    params: GetAllEventOutboundPortInputDto,
  ): Promise<GetAllEventOutboundPortOutputDto> {
    return this.prisma.event.findMany();
  }
}
