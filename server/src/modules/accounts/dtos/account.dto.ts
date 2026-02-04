import { Prisma} from "@prisma/client";

export type AccountDto = Pick<Prisma.AccountCreateInput, 'holder'>