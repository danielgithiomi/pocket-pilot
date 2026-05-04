import { ToastService } from '@atoms/toast';
import { AuthService } from './auth.service';
import { AwsMutation } from '@methods/mutations';
import { environment } from '@environments/environment';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, EMPTY, map, retry, switchMap, tap } from 'rxjs';
import { AwsPresignedUrlResponse, IStandardError, IStandardResponse, User } from '@global/types';

@Injectable({
  providedIn: 'root',
})
export class AwsService {
  private readonly http = inject(HttpClient);
  private readonly mutation = inject(AwsMutation);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  // SIGNALS
  private readonly uploadProgress = signal<number>(0);

  // EXPOSED SIGNALS
  progress = computed(() => this.uploadProgress());

  updateProfilePicture(file: File) {
    return this.mutation.getPresignedUploadUrl(file).pipe(
      map((response: IStandardResponse<AwsPresignedUrlResponse>) => response.data),
      switchMap((awsPresignedUrl: AwsPresignedUrlResponse) => {
        const { key, presignedUrl } = awsPresignedUrl;
        return this.http
          .put(presignedUrl, file, {
            headers: { 'Content-Type': file.type },
            reportProgress: true,
            observe: 'events' as const,
          })
          .pipe(
            map((event) => {
              switch (event.type) {
                case HttpEventType.UploadProgress: {
                  if (event.total) {
                    const progress = Math.round((event.loaded / event.total) * 100);
                    this.uploadProgress.set(progress);
                    return progress;
                  }
                  return 0;
                }
                case HttpEventType.Response: {
                  this.uploadProgress.set(100);
                  return 100;
                }
                default:
                  return 0;
              }
            }),
            switchMap((progress) => {
              if (progress === 100)
                return this.updateUserProfilePictureUrl(this.authService.user()!.id, key).pipe(
                  map((reponse: IStandardResponse<User>) => reponse.data),
                  tap((user: User) => this.authService.refreshSession(user)),
                  map(() => 100),
                );
              return [progress];
            }),
          );
      }),
      retry(2),
      catchError((error) => {
        console.error('ERROR from AWS Service', error);
        this.renderToast({
          type: 'error',
          details: error.message,
          statusCode: error.status,
          title: 'Failed to update user profile picture',
        });
        return EMPTY;
      }),
    );
  }

  // HELPER FUNCTIONS
  private updateUserProfilePictureUrl(userId: string, key: string) {
    const region = environment.awsRegion;
    const s3BucketName = environment.awsS3BucketName;
    const profilePictureUrl = `https://${s3BucketName}.s3.${region}.amazonaws.com/${key}`;
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
