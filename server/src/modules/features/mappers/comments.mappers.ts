import { FeatureCommentDto, PrismaComment } from '../dto/comments.dto';

/**
 * Maps a Prisma Comment to a Feature Comment DTO.
 * @param comment Prisma Comment
 * @param formatProfilePictureUrl Function to format the profile picture URL
 */
export async function mapPrismaCommentToDto(
    comment: PrismaComment,
    formatProfilePictureUrl: (key: string | null) => Promise<string | null>
): Promise<FeatureCommentDto> {
    const {
        author: { name: authorName, profilePictureKey, profilePictureThumbnailKey },
        ...rest
    } = comment;

    const [authorProfilePictureUrl, authorProfilePictureThumbnailUrl] = await Promise.all([
        formatProfilePictureUrl(profilePictureKey),
        formatProfilePictureUrl(profilePictureThumbnailKey)
    ]);

    return {
        authorName,
        authorProfilePictureUrl,
        authorProfilePictureThumbnailUrl,
        ...rest
    };
}
