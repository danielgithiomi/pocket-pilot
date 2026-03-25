import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@infrastructure/database/database.service';

@Injectable()
export class CategoriesRepository {
    constructor(private readonly db: DatabaseService) {}

    getAllUserCategories(userId: string) {
        return this.db.categories.findUnique({
            where: { userId },
            include: {
                user: { select: { id: true, name: true } },
            },
        });
    }

    createOrUpdateUserCategories(userId: string, categories: string[]) {
        return this.db.$transaction(async prisma => {
            const existingRow = await prisma.categories.findUnique({
                where: { userId },
            });

            const existingCategories = existingRow?.categories || [];

            const mergedCategories = Array.from(new Set([...existingCategories, ...categories]));

            return prisma.categories.upsert({
                where: { userId },
                update: { categories: mergedCategories },
                create: { categories: mergedCategories, userId },
                include: { user: { select: { id: true, name: true } } },
            });
        });
    }
}
