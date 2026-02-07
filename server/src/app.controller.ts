import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot(): string {
    return 'You have successfully called the Pocket Pilot API!';
  }
}
