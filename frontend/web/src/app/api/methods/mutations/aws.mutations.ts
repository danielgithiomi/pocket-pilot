import { ApiClient } from '@methods/api-client';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS as endpoints } from '@global/constants';
import { AwsPresignedUrlResponse, IUpdateUserProfilePictureRequest, User } from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class AwsMutation {
  private readonly client = inject(ApiClient);

  getPresignedUploadUrl(file: File) {
    return this.client.uploadFile<AwsPresignedUrlResponse>(
      endpoints.presigned_url,
      file,
      'profile-picture',
    );
  }

  updateUserProfileWithPictureKey(userId: string, profilePictureAwsKey: string) {
    const url = `users/${userId}/profile-picture`;
    return this.client.put<User, IUpdateUserProfilePictureRequest>(url, { profilePictureAwsKey });
  }
}
