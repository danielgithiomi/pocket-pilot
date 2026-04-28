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
        protected readonly defaultTTL: number = 60, // 60 seconds (1 minute)
    ) {
        this.TTL = this.defaultTTL;
        this.PREFIX = this.cachePrefix;
    }

    async getOrSetCache<V = T>(id: string, callback: () => Promise<V>, ttl: number = this.TTL): Promise<V> {
        const key = this.key(id);
        const cachedValue = await this.cache.get<V>(key);
        if (cachedValue) return cachedValue;

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

    async invalidateCaches(cacheIds: string[]): Promise<void> {
        cacheIds.forEach(async id => {
            const cacheKey = this.key(id);
            await this.cache.del(cacheKey);
        });
    }

    async clearCache(): Promise<void> {
        await this.cache.clear();
    }

    private key(id: string): string {
        return `${this.PREFIX}:${id}`;
    }
}
