import { CookiesAuthGuard } from '@common/guards';
import { OnboardingPayload } from '../dto/onboarding.dto';
import { Summary, UserInRequest } from '@common/decorators';
import { OnboardingService } from '../services/onboarding.service';
import { ApiBody, ApiCookieAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { UserResponseDto as User, UserWithPreferencesDto } from '../dto/user.dto';

@Controller('onboarding')
export class OnboardingController {
    constructor(private readonly onboardingService: OnboardingService) {}

    @Post()
    @HttpCode(200)
    @UseGuards(CookiesAuthGuard)
    @ApiCookieAuth('access_token')
    @ApiBody({ type: OnboardingPayload, required: true })
    @Summary('Onboarding Successful.', 'The user is onboarded successfully.')
    @ApiOperation({
        summary: 'Onboard a new user',
        description: 'Onboard a new user with the provided payload.',
    })
    @ApiResponse({ status: 200, type: UserWithPreferencesDto, description: 'User onboarded successfully.' })
    onboardUser(@UserInRequest() user: User, @Body() payload: OnboardingPayload) {
        return this.onboardingService.onboardUser(user.id, payload);
    }
}
