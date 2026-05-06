/* eslint-disable @typescript-eslint/no-unused-vars */
import { Multer } from 'multer';
import { mbToBytes } from '@libs/utils';
import { AwsService } from './aws.service';
import { CookiesAuthGuard } from '@common/guards';
import { PreSignedUrlResponseDto } from './aws.types';
import { AWS_FILE_CONSTANTS } from '@common/constants';
import { FileInterceptor } from '@nestjs/platform-express';
import { Summary, UserInRequest } from '@common/decorators';
import type { UserResponseDto as User } from '@modules/identity/dto/user.dto';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
    Post,
    HttpCode,
    UseGuards,
    Controller,
    UploadedFile,
    ParseFilePipe,
    UseInterceptors,
    FileTypeValidator,
    MaxFileSizeValidator,
} from '@nestjs/common';

@Controller('aws')
@UseGuards(CookiesAuthGuard)
@ApiTags('AWS')
export class AwsController {
    constructor(private readonly awsService: AwsService) {}

    @Post('presigned-url')
    @UseInterceptors(FileInterceptor('profile-picture'))
    @HttpCode(201)
    @ApiTags('AWS')
    @ApiCookieAuth('access_token')
    @Summary('Initiate profile picture upload', 'The user initiated a profile picture upload')
    @ApiOperation({ summary: 'Initiate profile picture upload' })
    @ApiResponse({
        status: 201,
        isArray: false,
        type: PreSignedUrlResponseDto,
        description: 'Presigned URL generated successfully',
    })
    initiateProfilePictureUpload(
        @UserInRequest() user: User,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({
                        maxSize: mbToBytes(AWS_FILE_CONSTANTS.MAX_FILE_SIZE),
                        errorMessage: `File size exceeds the maximum allowed size of ${AWS_FILE_CONSTANTS.MAX_FILE_SIZE} MBs.`,
                    }),
                    new FileTypeValidator({
                        fileType: new RegExp(AWS_FILE_CONSTANTS.ALLOWED_FILE_TYPES.join('|')),
                        errorMessage: `File type not allowed. Allowed types: ${AWS_FILE_CONSTANTS.ALLOWED_FILE_TYPES.join(', ')}`,
                    }),
                ],
            }),
        )
        file: Express.Multer.File,
    ) {
        return this.awsService.generateProfilePicturePresignedUrl(user, file.mimetype, file.size);
    }
}
