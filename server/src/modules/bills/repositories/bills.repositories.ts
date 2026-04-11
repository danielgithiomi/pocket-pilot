import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { CreateBillPayload } from '../dto/bills.dto';
import { DatabaseService } from '@infrastructure/database/database.service';

@Injectable()
export class BillsRepository {
    constructor(private readonly db: DatabaseService) {}

    getAllBills() {
        return this.db.bills.findMany({});
    }

    getUserBills(userId: string) {
        return this.db.bills.findMany({
            where: { userId },
        });
    }

    createNewBill(userId: string, payload: CreateBillPayload): Promise<Prisma.BillsCreateInput> {
        return this.db.bills.create({
            data: {
                ...payload,
                userId,
            },
        });
    }
}
