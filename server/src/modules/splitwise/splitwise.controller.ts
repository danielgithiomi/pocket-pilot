import { Controller } from '@nestjs/common';
import { SplitwiseService } from './splitwise.service';

@Controller('splitwise')
export class SplitwiseController {
  constructor(private readonly splitwiseService: SplitwiseService) {}

  
}
