import { User } from '@modules/identity/dto/user.dto';

declare module 'express' {
    export interface Request {
        user?: User;
    }
}
