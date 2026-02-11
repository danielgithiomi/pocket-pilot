import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
    @ApiTags('App')
    @Get()
    getRoot(): string {
        return 'You have successfully called the Pocket Pilot API!';
    }
}
