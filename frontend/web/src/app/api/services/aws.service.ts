import { ToastService } from '@atoms/toast';
import { AwsMutation } from '@methods/mutations';
import { inject, Injectable } from '@angular/core';
import { catchError, EMPTY, map, Observable } from 'rxjs';
import { AwsPresignedUrlResponse, IStandardError, IStandardResponse } from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class AwsService {
  private readonly mutation = inject(AwsMutation);
  private readonly toastService = inject(ToastService);

  updateProfilePicture(file: File): Observable<AwsPresignedUrlResponse> {
    return this.mutation.getPresignedUploadUrl(file).pipe(
      map((response: IStandardResponse<AwsPresignedUrlResponse>) => response.data),
      catchError((error) => {
        this.renderToast({
          type: 'error',
          details: error.message,
          statusCode: error.status,
          title: 'Failed to get presigned URL',
        });
        console.error('ERROR from AWS Service', error);
        return EMPTY;
      }),
    );
  }

  // HELPER FUNCTIONS
  private renderToast = (error: IStandardError) => {
    const { title, details } = error;
    this.toastService.show({
      title,
      variant: 'error',
      details: details as string,
    });
  };
}
