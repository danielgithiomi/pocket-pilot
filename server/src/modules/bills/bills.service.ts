import { BillType } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { formatEnumForFrontend } from '@libs/utils';
import { plainToInstance } from 'class-transformer';
import { CreateBillPayload, BillDTO } from './dto/bills.dto';
import { BillsRepository } from './repositories/bills.repositories';

@Injectable()
export class BillsService {
    constructor(private readonly billsRepository: BillsRepository) {}

    async getBillsTypes() {
        return await Promise.resolve(Object.values(BillType).map(formatEnumForFrontend));
    }

    async getAllBills() {
        return await this.billsRepository.getAllBills();
    }

    async getUserBills(userId: string) {
        return await this.billsRepository.getUserBills(userId);
    }

    async createNewBill(userId: string, payload: CreateBillPayload): Promise<BillDTO> {
        const createdBill = await this.billsRepository.createNewBill(userId, payload);
        return plainToInstance(BillDTO, createdBill);
    }
}
