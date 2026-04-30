/* eslint-disable @typescript-eslint/no-unused-vars */ 
import { Multer } from 'multer';
import { AwsService } from './aws.service';
import { CookiesAuthGuard } from '@common/guards';
import { UserInRequest } from '@common/decorators';
import { AWS_FILE_CONSTANTS } from '@common/constants';
import { FileInterceptor } from '@nestjs/platform-express';
import type { UserResponseDto as User } from '@modules/identity/dto/user.dto';
import {
    Post,
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
export class AwsController {
    constructor(private readonly awsService: AwsService) {}

    @Post('initiate')
    @UseInterceptors(FileInterceptor('profile-picture'))
    initiateProfilePictureUpload(
        @UserInRequest() user: User,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: AWS_FILE_CONSTANTS.MAX_FILE_SIZE }),
                    new FileTypeValidator({
                        fileType: new RegExp(AWS_FILE_CONSTANTS.ALLOWED_FILE_TYPES.join('|')),
                    }),
                ],
            }),
        )
        file: Express.Multer.File,
    ) {
        return this.awsService.generateProfilePicturePresignedUrl(user, file.mimetype, file.size);
    }
}
