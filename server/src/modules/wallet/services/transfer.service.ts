import { Injectable } from "@nestjs/common";
import { TransactionRepository } from "../repositories/transaction.respository";

@Injectable()
export class TransferService {

    constructor(
        private readonly transactionRepository: TransactionRepository
    ) {}

    
    
}