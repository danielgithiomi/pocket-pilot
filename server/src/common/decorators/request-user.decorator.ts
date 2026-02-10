import { Request } from 'express';
import { User } from '@modules/identity/dto/user.dto';
import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

export const UserInRequest = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user as User;
});
