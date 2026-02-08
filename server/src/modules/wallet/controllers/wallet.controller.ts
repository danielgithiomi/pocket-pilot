import {Controller} from '@nestjs/common';
import {WalletService} from '../services/wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}
}
