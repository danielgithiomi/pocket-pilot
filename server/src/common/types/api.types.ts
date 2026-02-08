export interface WithCountResponse<T> {
    count: number;
    data: T[];
}

export interface DeleteResourceResponse {
    message: string;
    details: string;
}
