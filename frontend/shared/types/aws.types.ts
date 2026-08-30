export type ProfilePictureUploadVariant = "original" | "thumbnail";

export interface AwsPresignedUrlResponse {
  key: string;
  presignedUrl: string;
}
