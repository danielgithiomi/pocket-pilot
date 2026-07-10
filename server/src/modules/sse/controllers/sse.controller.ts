import { interval, Observable, tap } from 'rxjs';
import { ApiOperation } from '@nestjs/swagger';
import { CookiesAuthGuard } from '@common/guards';
import { SSEService } from '@modules/sse/services/sse.service';
import { RawResponse, Summary, UserInRequest } from '@common/decorators';
import { UserResponseDto as User } from '@modules/identity/dto/user.dto';
import { Controller, MessageEvent, Sse, UseGuards } from '@nestjs/common';

@UseGuards(CookiesAuthGuard)
@Controller('sse/events')
export class SSEController {
    constructor(private readonly sseService: SSEService) {}

    @RawResponse()
    @Sse('connection')
    @Summary('SSE connection', 'Subscribe to the health of the server-sent events (SSE) connection.')
    @ApiOperation({
        summary: 'SSE connection',
        description: 'Subscribe to the health of the server-sent events (SSE) connection.'
    })
    connection() {
        return interval(3000).pipe(
            tap(() => {
                const now = new Date(Date.now()).toISOString();
                console.log(`SSE connection is still alive at: ${now}`);
            })
        );
    }

    @RawResponse()
    @Sse('stream')
    @Summary('SSE stream', 'Subscribe to the user server-sent events (SSE) stream.')
    @ApiOperation({ summary: 'SSE stream', description: 'Subscribe to the user server-sent events (SSE) stream.' })
    stream(@UserInRequest() user: User): Observable<MessageEvent> {
        return this.sseService.streamForUser(user.id);
    }
}
