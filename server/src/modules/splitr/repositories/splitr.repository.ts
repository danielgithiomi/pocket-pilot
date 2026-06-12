import { Injectable } from '@nestjs/common';
import { SettleSplitrPayload, SplitrEventPayload } from '../dto/splitr.dto';
import { DatabaseService } from '@infrastructure/database/database.service';

@Injectable()
export class SplitrRepository {
    constructor(private readonly db: DatabaseService) {}

    async createSplitrEvent(userId: string, payload: SplitrEventPayload) {
        const { billPayers, eventSplittables, ...rest } = payload;
        return await this.db.splitrEvent.create({
            data: {
                ...rest,
                creatorId: userId,
                billPayers: { create: billPayers },
                eventSplittables: {
                    create: eventSplittables.map(({ quantitySplits, ...splittable }) => ({
                        ...splittable,
                        quantitySplits: { create: quantitySplits }
                    }))
                }
            },
            include: {
                billPayers: true,
                eventSplittables: { include: { quantitySplits: true } }
            }
        });
    }

    getUserSplitrEvents(userId: string) {
        return this.db.splitrEvent.findMany({
            where: { creatorId: userId },
            include: { billPayers: true, eventSplittables: { include: { quantitySplits: true } } },
            orderBy: { createdAt: 'desc' }
        });
    }

    getSplitrEventById(eventId: string) {
        return this.db.splitrEvent.findUnique({
            where: { id: eventId },
            include: { billPayers: true, eventSplittables: { include: { quantitySplits: true } } }
        });
    }

    markSplitrEventAsSettledOrPending(userId: string, eventId: string, payload: SettleSplitrPayload) {
        const { isSettled } = payload;
        return this.db.splitrEvent.update({
            where: { id: eventId, creatorId: userId },
            data: { isSettled },
            include: { billPayers: true, eventSplittables: { include: { quantitySplits: true } } }
        });
    }

    deleteSplitrEvent(userId: string, eventId: string) {
        return this.db.splitrEvent.delete({
            where: { id: eventId, creatorId: userId },
            include: { billPayers: true, eventSplittables: { include: { quantitySplits: true } } }
        });
    }
}
