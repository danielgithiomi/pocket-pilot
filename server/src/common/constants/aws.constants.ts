import { mbToBytes } from '@libs/utils';

export const AWS_FILE_CONSTANTS = {
    MAX_FILE_SIZE: mbToBytes(2),
    ALLOWED_FILE_TYPES: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
};
