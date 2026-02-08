import { Controller, Get } from '@nestjs/common';
import { WalletService } from '../services/wallet.service';

@Controller('wallet')
export class WalletController {
    constructor(private readonly walletService: WalletService) {}

    @Get()
    getWallet() {
        return 'This is the wallet controller!';
    }
}
