import { PrismaService } from 'src/database/prisma.service';

export class FindPostRepository {
  constructor(private prisma: PrismaService) {}
  async execute(params) {
    const channel = this.prisma.channel.findUnique({
      where: {
        id: params.id,
      },
    });

    return channel.posts;
  }
}
