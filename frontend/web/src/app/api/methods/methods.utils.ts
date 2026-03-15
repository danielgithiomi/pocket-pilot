import { environment } from '@environments/environment';

const BASE_URL: string = environment.API_BASE_URL;

export function concatUrl(endpoint: string = ''): string {
  return `${BASE_URL}${endpoint}`;
}
