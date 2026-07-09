import { Observable } from 'rxjs';
import { ApiOperation } from '@nestjs/swagger';
import { Controller, MessageEvent, Sse } from '@nestjs/common';
import { SSEService } from '@modules/sse/services/sse.service';
import { RawResponse, Summary, UserInRequest } from '@common/decorators';
import { UserResponseDto as User } from '@modules/identity/dto/user.dto';

@Controller('sse/events')
export class SSEController {
    constructor(private readonly sseService: SSEService) {}

    @Sse('stream')
    @RawResponse()
    @Summary('SSE stream', 'Subscribe to the user server-sent events (SSE) stream.')
    @ApiOperation({ summary: 'SSE stream', description: 'Subscribe to the user server-sent events (SSE) stream.' })
    stream(@UserInRequest() user: User): Observable<MessageEvent> {
        console.log('Setting up user SSE stream');

        return this.sseService.streamForUser(user.id);
    }
}
