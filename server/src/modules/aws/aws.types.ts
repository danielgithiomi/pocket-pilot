import { ApiProperty } from '@nestjs/swagger';

export interface PreSignedUrlResponse {
    key: string;
    presignedUrl: string;
}

export class PreSignedUrlResponseDto {
    @ApiProperty({
        example: 'user/123/profile-picture.jpg',
        description: 'The key of the file',
    })
    key!: string;

    @ApiProperty({
        example: 'https://s3.amazonaws.com/bucket/user/123/profile-picture.jpg',
        description: 'The presigned URL of the file',
    })
    presignedUrl!: string;
}
