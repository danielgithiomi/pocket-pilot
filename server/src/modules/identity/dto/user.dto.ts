import {Prisma} from "@prisma/client";

export type UserDto = Pick<Prisma.UserCreateInput, 'name'>;