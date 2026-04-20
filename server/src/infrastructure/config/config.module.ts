import { Module } from '@nestjs/common';
import { PPConfigSchema } from './config.schema';
import { PPConfigService } from './config.service';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

@Module({
    exports: [PPConfigService],
    providers: [PPConfigService],
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            validate: (config: PPConfigModule) => {
                const parsedResult = PPConfigSchema.safeParse(config);

                if (!parsedResult.success || parsedResult.error) {
                    console.error('Invalid Configuration!');

                    const errors = parsedResult.error?.issues;
                    errors?.forEach(console.error);

                    throw new Error('An error occurred parsing the configuration');
                }

                return parsedResult.data;
            },
        }),
    ],
})
export class PPConfigModule {}
