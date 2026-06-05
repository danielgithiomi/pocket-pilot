import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@infrastructure/database/database.service';

@Injectable()
export class FeaturesRepository {
    constructor(private readonly db: DatabaseService) {}
}
