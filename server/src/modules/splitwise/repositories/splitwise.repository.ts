import { Injectable } from '@nestjs/common';
import { SplitwiseEventPayload } from '../dto/splitwise.dto';
import { DatabaseService } from '@infrastructure/database/database.service';

@Injectable()
export class SplitwiseRepository {
    constructor(private readonly db: DatabaseService) {}

    async createSplitwiseEvent(userId: string, payload: SplitwiseEventPayload) {
        const { billPayers, splittables, ...rest } = payload;
        return await this.db.splitwiseEvent.create({
            data: {
                ...rest,
                creatorId: userId,
                billPayers: { create: billPayers },
                eventSplittables: {
                    create: splittables.map(({ quantitySplits, ...splittable }) => ({
                        ...splittable,
                        quantitySplits: { create: quantitySplits },
                    })),
                },
            },
            include: {
                billPayers: true,
                eventSplittables: { include: { quantitySplits: true } },
            },
        });
    }
}
