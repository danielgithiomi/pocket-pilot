import { Injectable } from '@nestjs/common';
import { SplitrSquadPayload } from '../dto/squads.dto';
import { DatabaseService } from '@infrastructure/database/database.service';

@Injectable()
export class SquadsRepository {
    constructor(private readonly db: DatabaseService) {}

    createNewSplitrSquad(userId: string, payload: SplitrSquadPayload) {
        return this.db.splitrSquad.create({ data: { ...payload, creatorId: userId } });
    }

    getUserSplitrSquads(userId: string) {
        return this.db.splitrSquad.findMany({ where: { creatorId: userId } });
    }

    updateExistingUserSplitrSquad(userId: string, squadId: string, payload: SplitrSquadPayload) {
        return this.db.splitrSquad.update({ where: { id: squadId, creatorId: userId }, data: payload });
    }

    deleteUserSplitrSquad(userId: string, squadId: string) {
        return this.db.splitrSquad.delete({ where: { id: squadId, creatorId: userId } });
    }
}
