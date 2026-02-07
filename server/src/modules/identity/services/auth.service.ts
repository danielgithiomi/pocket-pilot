import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@infrastructure/database/database.service';
import { LoginInputDto } from '../dto/user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly db: DatabaseService) {}

  async login(data: LoginInputDto): Promise<boolean> {
    const { email } = data;

    const user = await this.db.user.findUnique({
      where: { email },
    });

    if (!user)
      throw new NotFoundException({
        message: 'User not found',
        details: `No user found in the database with the email: ${email}`,
      });

    return !!user;
  }
}
