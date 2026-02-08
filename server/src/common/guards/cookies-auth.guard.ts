import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { RequestCookies } from '@common/constants';
import { JWTPayload, User } from '@modules/identity/dto/user.dto';
import { UserService } from '@modules/identity/services/user.service';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class CookiesAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const endpoint: string = request.url;

        const { access_token, refresh_token } = request.cookies as RequestCookies;

        if (!access_token || !refresh_token) {
            throw new UnauthorizedException({
                name: 'Unauthorized',
                message: `Missing authentication cookies`,
                details: `Both the access and refresh tokens are required in the cookies to access ${endpoint}`,
            });
        }

        try {
            const decoded_payload: JWTPayload = this.jwtService.verify(access_token);

            const user: User = await this.userService.findUserById(decoded_payload.sub);

            request.user = user;

            return true;
        } catch (error) {
            throw new UnauthorizedException({
                name: 'JWT Decode Error',
                message: `Invalid authentication cookies`,
                details: `Could not decode the access token to get the payload. ${error}`,
            });
        }
    }
}
