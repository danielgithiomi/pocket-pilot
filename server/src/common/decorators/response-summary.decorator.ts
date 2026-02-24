import { SetMetadata } from '@nestjs/common';
import { IResponseSummary } from '@common/types';
import { RESPONSE_SUMMARY_REFLECTOR_KEY as summary_key } from '@common/constants';

export const Summary = (message: string, description?: string) =>
    SetMetadata(summary_key, { title: message, details: description } as IResponseSummary);
