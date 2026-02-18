import {Observable} from 'rxjs';
import type {Request} from 'express';
import {JwtService} from '@nestjs/jwt';
import {IRequestCookies} from '@common/types';
import {User} from '@modules/identity/dto/user.dto';
import {JWTPayload} from '@modules/identity/dto/auth.dto';
import {UserService} from '@modules/identity/services/user.service';
import {type CallHandler, type ExecutionContext, type NestInterceptor, UnauthorizedException} from '@nestjs/common';

export class AuthTokenInterceptor implements NestInterceptor {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request: Request = context.switchToHttp().getRequest();

        const endpoint: string = request.url;

        const { access_token, refresh_token } = request.cookies as IRequestCookies;

        if (!access_token || !refresh_token) {
            throw new UnauthorizedException({
                name: 'Unauthorized',
                message: `Missing authentication cookies`,
                details: `Both the access and refresh tokens are required in the cookies to access ${endpoint}`,
            });
        }

        console.log('access_token', access_token);
        console.log('refresh_token', refresh_token);

        try {
            const decoded_payload: JWTPayload = this.jwtService.verify(access_token);

            console.log(decoded_payload);

            const user: User = await this.userService.findUserById(decoded_payload.sub);

            request.user = user;

            return next.handle();
        } catch (error) {
            throw new UnauthorizedException({
                name: 'JWT Decode Error',
                message: `Invalid authentication cookies`,
                details: `Could not decode the access token to get the payload. ${error}`,
            });
        }
    }
}
