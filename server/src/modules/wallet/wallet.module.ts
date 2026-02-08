import {Module} from '@nestjs/common';
import {WalletService} from './services/wallet.service';
import {WalletController} from './controllers/wallet.controller';

@Module({
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
