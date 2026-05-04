import { ToastService } from '@atoms/toast';
import { AuthService } from './auth.service';
import { AwsMutation } from '@methods/mutations';
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { catchError, EMPTY, map, Observable, retry, Subscription, switchMap } from 'rxjs';
import { AwsPresignedUrlResponse, IStandardError, IStandardResponse } from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class AwsService {
  private readonly http = inject(HttpClient);
  private readonly mutation = inject(AwsMutation);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  // async updateProfilePicture(file: File): Observable<AwsPresignedUrlResponse> {
  updateProfilePicture(file: File) {
    return this.mutation.getPresignedUploadUrl(file).pipe(
      map((response: IStandardResponse<AwsPresignedUrlResponse>) => response.data),
      switchMap((awsPresignedUrl: AwsPresignedUrlResponse) => {
        const { key, presignedUrl } = awsPresignedUrl;
        return this.http
          .put(presignedUrl, file, {
            headers: { 'Content-Type': file.type },
            reportProgress: true,
            observe: 'events',
          })
          .pipe(
            map((event) => {
              console.log('Upload event', event);
              if (event.type === HttpEventType.UploadProgress && event.total) {
                const progress = Math.round((event.loaded / event.total) * 100);
                return progress;
              }
              if (event.type === HttpEventType.Response) return 100;
              return 0;
            }),
            switchMap((progress) => {
              console.log('Progress', progress);
              if (progress === 100)
                return this.updateUserProfilePictureUrl(this.authService.user()!.id, key).pipe(
                  map(() => 100),
                );
              return [progress];
            }),
          );
      }),
      retry(2),
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
  private updateUserProfilePictureUrl(userId: string, profilePictureUrl: string) {
    return this.mutation.updateUserProfileWithPictureUrl(userId, profilePictureUrl);
  }

  private renderToast = (error: IStandardError) => {
    const { title, details } = error;
    this.toastService.show({
      title,
      variant: 'error',
      details: details as string,
    });
  };
}
