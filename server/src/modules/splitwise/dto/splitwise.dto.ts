import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SplitwiseSquadPayload {
    @Expose()
    @ApiProperty({
        example: 'My Squad',
        description: 'The name of the squad',
    })
    squadName!: string;

    @Expose()
    @ApiProperty({
        description: 'The members of the squad',
        example: ['Daniel', 'Joshua', 'Michelle'],
    })
    squadMembers!: string[];

    @Expose()
    @ApiProperty({
        example: 'squad-image-key',
        description: 'The image key of the squad',
    })
    squadImageKey!: string | null;
}

@Exclude()
export class SplitwiseSquadDto {
    @Expose()
    @ApiProperty({
        description: 'The ID of the squad',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    id!: string;

    @Expose()
    @ApiProperty({
        description: 'The ID of the creator',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    creatorId!: string;

    @Expose()
    @ApiProperty({
        description: 'The name of the squad',
        example: 'My Squad',
    })
    squadName!: string;

    @Expose()
    @ApiProperty({
        description: 'The image key of the squad',
        example: 'squad-image-key',
    })
    squadImageKey!: string | null;

    @Expose()
    @ApiProperty({
        description: 'The members of the squad',
        example: ['123e4567-e89b-12d3-a456-426614174000'],
    })
    squadMembers!: string[];

    @Expose()
    @ApiProperty({
        description: 'The creation date of the squad',
        example: '2025-10-15T10:30:00.000Z',
    })
    createdAt!: Date;

    @Expose()
    @ApiProperty({
        description: 'The last update date of the squad',
        example: '2025-10-15T10:30:00.000Z',
    })
    updatedAt!: Date;
}
