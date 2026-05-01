import { ApiClient } from '@methods/api-client';
import { inject, Injectable } from '@angular/core';
import { AwsPresignedUrlResponse } from '@global/types';
import { API_ENDPOINTS as endpoints } from '@global/constants';

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
}
