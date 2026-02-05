import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@infrastructure/database/database.service';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly db: DatabaseService) {}

  createUser(data: UserDto) {
    return this.db.user.create({ data });
  }
}
