import { SetMetadata } from '@nestjs/common';
import { RAW_RESPONSE_REFLECTOR_KEY } from '../constants';

export const RawResponse = () => SetMetadata(RAW_RESPONSE_REFLECTOR_KEY, true);
