import { Injectable } from '@nestjs/common';
import { PreSignedUrlResponse } from './aws.types';
import { PPConfigService } from '@infrastructure/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class AwsService {
    private readonly s3Client: S3Client;
    private readonly s3BucketName: string;

    constructor(private readonly configService: PPConfigService) {
        const { maxAttempts, socketTimeout, connectionTimeout, region, accessKeyId, secretAccessKey, s3BucketName } =
            this.configService.aws;
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
        this.s3BucketName = s3BucketName;
    }

    async generateProfilePicturePresignedUrl(fileSize: number): Promise<PreSignedUrlResponse> {
        const key = 'profile-picture';
        const { presignedUrlExpiration: expiresIn } = this.configService.aws;

        const uploadCommand: PutObjectCommand = new PutObjectCommand({
            Bucket: this.s3BucketName,
            Key: key,
            ContentType: 'image/jpeg',
            ContentLength: fileSize,
        });

        const presignedUrl = await getSignedUrl(this.s3Client, uploadCommand, {
            expiresIn,
        });

        return Promise.resolve({
            uploadKey: key,
            presignedUrl,
        });
    }
}
