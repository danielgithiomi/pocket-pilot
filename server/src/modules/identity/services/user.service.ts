import { type RegisterInputDto } from '../dto/user.dto';
import { HttpCode, HttpStatus, Injectable, Post } from '@nestjs/common';
import { DatabaseService } from '@infrastructure/database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly db: DatabaseService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  registerUser(data: RegisterInputDto) {
    return this.db.user.create({ data });
  }
}
