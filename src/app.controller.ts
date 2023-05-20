import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('createUser')
  createUser(@Body() body) {
    this.appService.createUser(body);
    this.appService.mintNFT(body);
  }

  @Post('mint')
  mint(@Body() body) {
    this.appService.mintNFT(body);
  }

  @Post('event')
  callEvent(@Body() eventRequest) {
    this.appService.callEvent(eventRequest);
  }
}
