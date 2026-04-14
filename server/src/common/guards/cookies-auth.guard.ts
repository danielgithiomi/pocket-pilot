import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IRequestCookies } from '@common/types';
import { IS_PUBLIC_KEY } from '@common/decorators';
import { plainToInstance } from 'class-transformer';
import { JWTPayload } from '@modules/identity/dto/auth.dto';
import { UserService } from '@modules/identity/services/user.service';
import { UserResponseDto, UserWithPreferencesDto } from '@modules/identity/dto/user.dto';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class CookiesAuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) return true;

        const request: Request = context.switchToHttp().getRequest();
        const endpoint: string = request.url;

        const { access_token } = request.cookies as IRequestCookies;

        if (!access_token) {
            throw new UnauthorizedException({
                name: 'MISSING_ACCESS_TOKEN',
                title: 'Missing access token',
                message: `Missing authentication cookies`,
                details: `The access token is required in the cookies to access ${endpoint}`,
            });
        }

        // if (!access_token || !refresh_token) {
        //     throw new UnauthorizedException({
        //         name: 'Unauthorized',
        //         message: `Missing authentication cookies`,
        //         details: `Both the access and refresh tokens are required in the cookies to access ${endpoint}`,
        //     });
        // }

        try {
            const decoded_payload: JWTPayload = this.jwtService.verify(access_token);

            const user: UserWithPreferencesDto = await this.userService.findUserById(decoded_payload.sub);

            request.user = plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true });

            return true;
        } catch (error) {
            throw new UnauthorizedException({
                name: 'JWT Decode Error',
                title: 'Invalid authentication cookies',
                message: `Invalid authentication cookies`,
                details: `Could not decode the access token to get the payload. ${error}`,
            });
        }
    }
}
