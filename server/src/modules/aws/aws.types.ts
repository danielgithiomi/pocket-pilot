import { ApiProperty } from '@nestjs/swagger';

export interface PreSignedUrlResponse {
    key: string;
    presignedUrl: string;
}

export class PreSignedUrlResponseDto {
    @ApiProperty({
        description: 'The key of the file',
        example: 'user/123/profile-picture.jpg'
    })
    key!: string;

    @ApiProperty({
        description: 'The presigned URL of the file',
        example: 'https://s3.amazonaws.com/bucket/user/123/profile-picture.jpg'
    })
    presignedUrl!: string;
}
