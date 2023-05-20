import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  createUser(@Body() address): void {
    this.appService.createUser(address);
    this.appService.mintNFT(address);
  }

  @Get()
  callEvent(): string {
    return this.appService.callEvent();
  }
}
