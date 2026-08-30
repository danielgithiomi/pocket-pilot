import { ApiClient } from '@methods/api-client';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS as endpoints } from '@shared/constants';
import {
    AwsPresignedUrlResponse,
    IUpdateUserProfilePictureRequest,
    ProfilePictureUploadVariant,
    User
} from '@shared/types';

@Injectable({
    providedIn: 'root'
})
export class AwsMutation {
    private readonly client = inject(ApiClient);

    getPresignedUploadUrl(file: File, variant: ProfilePictureUploadVariant = 'original') {
        return this.client.uploadFile<AwsPresignedUrlResponse>(
            `${endpoints.presigned_url}?variant=${variant}`,
            file,
            'profile-picture'
        );
    }

    updateUserProfileWithPictureKeys(
        userId: string,
        profilePictureAwsKey: string,
        profilePictureThumbnailAwsKey: string
    ) {
        const url = `users/${userId}/profile-picture`;
        return this.client.put<User, IUpdateUserProfilePictureRequest>(url, {
            profilePictureAwsKey,
            profilePictureThumbnailAwsKey
        });
    }
}
