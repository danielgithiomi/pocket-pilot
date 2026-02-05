import { Controller } from '@nestjs/common';
import { IdentityService } from '../services/identity.service';

@Controller('identity')
export class IdentityController {
  constructor(private readonly identityService: IdentityService) {}
}
