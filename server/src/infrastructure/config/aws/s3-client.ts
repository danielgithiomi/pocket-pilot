import { Injectable } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { PPConfigService } from '../config.service';

@Injectable()
export class S3ClientService {
    private readonly s3Client: S3Client;
    private readonly s3BucketName: string;

    constructor(private readonly configServie: PPConfigService) {
        const { maxAttempts, socketTimeout, connectionTimeout, region, accessKeyId, secretAccessKey } =
            this.configServie.aws;

        this.s3Client = new S3Client({
            maxAttempts,
            requestHandler: {
                socketTimeout,
                connectionTimeout,
            },
            region,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
        this.s3BucketName = region;
    }
}
