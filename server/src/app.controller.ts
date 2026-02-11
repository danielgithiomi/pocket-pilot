import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('App')
export class AppController {
    @Get()
    @ApiResponse({ status: 200, description: 'You have successfully called the Pocket Pilot API!' })
    @ApiOperation({ summary: 'Get API root', description: 'Returns a success message if the API is running.' })
    getRoot(): string {
        return 'You have successfully called the Pocket Pilot API!';
    }
}
