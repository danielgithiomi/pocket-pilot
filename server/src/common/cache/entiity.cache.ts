import { Inject } from '@nestjs/common';
import { type Cache } from 'cache-manager';
import { secondsToMilliseconds } from '@libs/utils';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

export abstract class EntityCache<T> {
    protected readonly TTL: number;
    protected readonly PREFIX: string;

    protected constructor(
        @Inject(CACHE_MANAGER) protected readonly cache: Cache,
        protected readonly cachePrefix: string,
        protected readonly defaultTTL: number = 30, // 30 seconds
    ) {
        this.TTL = this.defaultTTL;
        this.PREFIX = this.cachePrefix;
    }

    async getOrSetCache(id: string, callback: () => Promise<T>, ttl: number = this.TTL): Promise<T> {
        const key = this.key(id);
        const cachedValue = await this.cache.get<T>(key);
        if (cachedValue) return cachedValue;

        // No cache found
        const freshValue = await callback();
        await this.cache.set(key, freshValue, secondsToMilliseconds(ttl));
        return freshValue;
    }

    async getCache(id: string): Promise<T | undefined> {
        const key = this.key(id);
        return await this.cache.get<T>(key);
    }

    async setCache(id: string, value: T, ttl: number = this.TTL): Promise<void> {
        const key = this.key(id);
        await this.cache.set(key, value, secondsToMilliseconds(ttl));
    }

    async invalidateCache(id: string): Promise<void> {
        const key = this.key(id);
        await this.cache.del(key);
    }

    async clearCache(): Promise<void> {
        await this.cache.clear();
    }

    private key(id: string): string {
        return `${this.PREFIX}:${id}`;
    }
}
