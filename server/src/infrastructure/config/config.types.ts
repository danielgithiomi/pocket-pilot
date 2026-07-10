export interface ISSEConfig {
    heartBeatIntervalMinutes: number;
}

export interface IRedisConfig {
    port: number;
    host: string;
    defaultTTL: number;
}

export interface IDatabaseConfig {
    url: string;
}
