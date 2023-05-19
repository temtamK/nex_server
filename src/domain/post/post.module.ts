import { Module } from "@nestjs/common";
import { PostController } from "./controller/post.contoller";
import { FindPostRepository } from "./outbound-adapter/db/find-post.repository";

@Module({
    controllers: [PostController],
    providers: [
        {
            provide: 'FIND_POST_INBOUND_PORT',
            useClass: FindPostService
        },
        {
            provide: 'FIND_POST_OUTBOUND_PORT',
            useClass: FindPostRepository
        }
    ],
  })