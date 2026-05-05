import { PreSignedUrlResponse } from './aws.types';
import { Injectable, Logger } from '@nestjs/common';
import { PPConfigService } from '@infrastructure/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { UserResponseDto as User } from '@modules/identity/dto/user.dto';
import { PutObjectCommand, HeadObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class AwsService {
    private readonly s3Client: S3Client;
    private readonly s3BucketName: string;
    private readonly logger = new Logger('AWS');

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

    async generateProfilePicturePresignedUrl(
        user: User,
        contentType: string,
        fileSize: number,
    ): Promise<PreSignedUrlResponse> {
        const ext = contentType.split('/')[1];
        const { presignedUrlExpiration: expiresIn } = this.configService.aws;
        const key = `${user.email}/profile-picture-${Date.now()}.${ext}`;

        const uploadCommand: PutObjectCommand = new PutObjectCommand({
            Bucket: this.s3BucketName,
            Key: key,
            ContentType: contentType,
            ContentLength: fileSize,
        });

        const presignedUrl = await getSignedUrl(this.s3Client, uploadCommand, {
            expiresIn,
        });

        return {
            key,
            presignedUrl,
        };
    }

    async generateProfilePictureUrl(profilePictureKey: string): Promise<string> {
        const s3BucketName = this.s3BucketName;
        const region = await this.s3Client.config.region();
        return `https://${s3BucketName}.s3.${region}.amazonaws.com/${profilePictureKey}`;
    }

    async checkAndGenerateProfilePictureUrl(profilePictureKey: string | null): Promise<string | null> {
        if (!profilePictureKey || !(await this.doesProfilePictureKeyExist(profilePictureKey))) return null;
        return await this.generateProfilePictureUrl(profilePictureKey);
    }

    private async doesProfilePictureKeyExist(Key: string) {
        try {
            const command = new HeadObjectCommand({
                Key,
                Bucket: this.s3BucketName,
            });
            await this.s3Client.send(command);
            return true;
        } catch (error) {
            this.logger.error(`Error checking if profile picture key (${Key}) exists`, error);
            return false;
        }
    }
}
