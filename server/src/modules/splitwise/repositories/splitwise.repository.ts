import { Injectable } from '@nestjs/common';
import { SplitwiseSquadPayload } from '../dto/splitwise.dto';
import { DatabaseService } from '@infrastructure/database/database.service';

@Injectable()
export class SplitwiseRepository {
    constructor(private readonly db: DatabaseService) {}

    createNewSplitWiseSquad(userId: string, payload: SplitwiseSquadPayload) {
        return this.db.splitwiseSquad.create({ data: { ...payload, creatorId: userId } });
    }

    getUserSplitwiseSquads(userId: string) {
        return this.db.splitwiseSquad.findMany({ where: { creatorId: userId } });
    }

    updateExistingUserSplitwiseSquad(userId: string, squadId: string, payload: SplitwiseSquadPayload) {
        return this.db.splitwiseSquad.update({ where: { id: squadId, creatorId: userId }, data: payload });
    }

    deleteUserSplitwiseSquad(userId: string, squadId: string) {
        return this.db.splitwiseSquad.delete({ where: { id: squadId, creatorId: userId } });
    }
}
