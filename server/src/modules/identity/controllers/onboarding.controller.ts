import { CookiesAuthGuard } from '@common/guards';
import { UserInRequest } from '@common/decorators';
import { OnboardingPayload } from '../dto/onboarding.dto';
import { UserResponseDto as User } from '../dto/user.dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { OnboardingService } from '../services/onboarding.service';

@Controller('onboarding')
export class OnboardingController {
    constructor(private readonly onboardingService: OnboardingService) {}

    @Post()
    @UseGuards(CookiesAuthGuard)
    onboardUser(@UserInRequest() user: User, @Body() payload: OnboardingPayload) {
        return this.onboardingService.onboardUser(user.id, payload);
    }
}
