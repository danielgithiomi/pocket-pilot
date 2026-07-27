import { ToastService } from '@atoms/toast';
import { AuthService } from './auth.service';
import { AwsMutation } from '@methods/mutations';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, EMPTY, filter, forkJoin, from, map, retry, switchMap, tap } from 'rxjs';
import {
    AwsPresignedUrlResponse,
    IStandardError,
    IStandardResponse,
    ProfilePictureUploadVariant,
    User
} from '@global/types';

@Injectable({
    providedIn: 'root'
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
        this.uploadProgress.set(0);

        return from(this.createProfilePictureThumbnail(file)).pipe(
            switchMap((profilePictureThumbnail) => {
                return forkJoin({
                    profilePictureAwsKey: this.uploadProfilePictureFile(file, 'original'),
                    profilePictureThumbnailAwsKey: this.uploadProfilePictureFile(profilePictureThumbnail, 'thumbnail')
                });
            }),
            switchMap(({ profilePictureAwsKey, profilePictureThumbnailAwsKey }) => {
                return this.updateUserProfilePictureKeys(
                    this.authService.user()!.id,
                    profilePictureAwsKey,
                    profilePictureThumbnailAwsKey
                ).pipe(
                    map((response: IStandardResponse<User>) => response.data),
                    tap((user: User) => this.authService.refreshSession(user)),
                    tap(() => this.uploadProgress.set(100)),
                    map(() => 100)
                );
            }),
            retry(2),
            catchError((error) => {
                console.error('ERROR from AWS Service', error);
                if (error.status !== 401)
                    this.renderToast({
                        type: 'error',
                        details: error.message,
                        statusCode: error.status,
                        title: 'Failed to update user profile picture'
                    });
                return EMPTY;
            })
        );
    }

    // HELPER FUNCTIONS
    private uploadProfilePictureFile(file: File, variant: ProfilePictureUploadVariant) {
        return this.mutation.getPresignedUploadUrl(file, variant).pipe(
            map((response: IStandardResponse<AwsPresignedUrlResponse>) => response.data),
            switchMap((awsPresignedUrl: AwsPresignedUrlResponse) => {
                const { key, presignedUrl } = awsPresignedUrl;

                return this.http
                    .put(presignedUrl, file, {
                        headers: { 'Content-Type': file.type },
                        reportProgress: true,
                        observe: 'events' as const
                    })
                    .pipe(
                        tap((event) => {
                            if (variant !== 'original' || event.type !== HttpEventType.UploadProgress || !event.total)
                                return;

                            const progress = Math.round((event.loaded / event.total) * 80);
                            this.uploadProgress.set(progress);
                        }),
                        filter((event) => event.type === HttpEventType.Response),
                        map(() => key)
                    );
            })
        );
    }

    private updateUserProfilePictureKeys(
        userId: string,
        profilePictureAwsKey: string,
        profilePictureThumbnailAwsKey: string
    ) {
        return this.mutation.updateUserProfileWithPictureKeys(
            userId,
            profilePictureAwsKey,
            profilePictureThumbnailAwsKey
        );
    }

    private async createProfilePictureThumbnail(file: File): Promise<File> {
        const { image, objectUrl } = await this.loadImage(file);

        try {
            const thumbnailSize = 96;
            const canvas = document.createElement('canvas');
            canvas.width = thumbnailSize;
            canvas.height = thumbnailSize;

            const context = canvas.getContext('2d');
            if (!context) throw new Error('Could not create a profile picture thumbnail.');

            const sourceWidth = image.naturalWidth || image.width;
            const sourceHeight = image.naturalHeight || image.height;
            const sourceSize = Math.min(sourceWidth, sourceHeight);
            const sourceX = (sourceWidth - sourceSize) / 2;
            const sourceY = (sourceHeight - sourceSize) / 2;

            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = 'high';
            context.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, 0, 0, thumbnailSize, thumbnailSize);

            const blob = await this.createCanvasBlob(canvas);
            const fileName = this.buildThumbnailFileName(file);

            return new File([blob], fileName, {
                type: blob.type,
                lastModified: Date.now()
            });
        } finally {
            URL.revokeObjectURL(objectUrl);
        }
    }

    private loadImage(file: File): Promise<{ image: HTMLImageElement; objectUrl: string }> {
        const objectUrl = URL.createObjectURL(file);

        return new Promise((resolve, reject) => {
            const image = new Image();

            image.onload = () => resolve({ image, objectUrl });
            image.onerror = () => {
                URL.revokeObjectURL(objectUrl);
                reject(new Error('Could not load the selected profile picture.'));
            };

            image.src = objectUrl;
        });
    }

    private createCanvasBlob(canvas: HTMLCanvasElement): Promise<Blob> {
        return new Promise((resolve, reject) => {
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                        return;
                    }

                    reject(new Error('Could not create a profile picture thumbnail.'));
                },
                'image/webp',
                0.86
            );
        });
    }

    private buildThumbnailFileName(file: File): string {
        const baseName = file.name.replace(/\.[^/.]+$/, '') || 'profile-picture';
        return `${baseName}-thumbnail.webp`;
    }

    private renderToast = (error: IStandardError) => {
        const { title, details } = error;
        this.toastService.show({
            title,
            variant: 'error',
            details: details as string
        });
    };
}
