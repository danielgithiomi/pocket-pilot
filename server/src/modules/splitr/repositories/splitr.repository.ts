import { Injectable } from '@nestjs/common';
import { SettleSplitrPayload, SplitrEventPayload } from '../dto/splitr.dto';
import { DatabaseService } from '@infrastructure/database/database.service';

@Injectable()
export class SplitrRepository {
    constructor(private readonly db: DatabaseService) {}

    createSplitrEvent(userId: string, payload: SplitrEventPayload) {
        const { billPayers, eventSplittables, ...rest } = payload;
        return this.db.splitrEvent.create({
            data: {
                ...rest,
                userId,
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
            where: { userId },
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
            where: { id: eventId, userId },
            data: { isSettled },
            include: { billPayers: true, eventSplittables: { include: { quantitySplits: true } } }
        });
    }

    deleteSplitrEvent(userId: string, eventId: string) {
        return this.db.splitrEvent.delete({
            where: { id: eventId, userId },
            include: { billPayers: true, eventSplittables: { include: { quantitySplits: true } } }
        });
    }
}
