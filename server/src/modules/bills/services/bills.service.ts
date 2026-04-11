import { BillType } from '@prisma/client';
import { formatEnumForFrontend } from '@libs/utils';
import { plainToInstance } from 'class-transformer';
import { CreateBillPayload, BillDTO } from '../dto/bills.dto';
import { ConflictException, Injectable } from '@nestjs/common';
import { BillsRepository } from '../repositories/bills.repositories';

@Injectable()
export class BillsService {
    constructor(private readonly billsRepository: BillsRepository) {}

    async getBillsTypes() {
        return await Promise.resolve(Object.values(BillType).map(formatEnumForFrontend));
    }

    getAllBills() {
        return this.billsRepository.getAllBills();
    }

    getUserBills(userId: string) {
        return this.billsRepository.getUserBills(userId);
    }

    async createNewBill(userId: string, payload: CreateBillPayload): Promise<BillDTO> {
        const existingBill = await this.getUserBills(userId);

        if (existingBill.some(bill => bill.name.toLowerCase() === payload.name.toLowerCase()))
            throw new ConflictException({
                type: 'BILL_NAME_ALREADY_EXISTS',
                title: 'Bill already exists!',
                details: `A bill with the name [${payload.name}] already exists.`,
            });

        const createdBill = await this.billsRepository.createNewBill(userId, payload);
        return plainToInstance(BillDTO, createdBill);
    }
}
