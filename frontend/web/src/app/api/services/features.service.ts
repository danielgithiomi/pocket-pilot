import { FeaturesResource } from '@methods/resources';
import { Feature, FeaturesWithCount, IEnumResponse } from '@global/types';
import { computed, effect, inject, Injectable, Signal, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class FeaturesService {
    private readonly resource = inject(FeaturesResource);

    private readonly _userFeatureRequests = signal<Feature[]>([]);
    private readonly _featureStatuses = signal<IEnumResponse[]>([]);
    private readonly _featureCategories = signal<IEnumResponse[]>([]);
    private readonly _featureVoteVariants = signal<IEnumResponse[]>([]);
    private readonly _featureRequests = signal<FeaturesWithCount>({ count: 0, features: [] });

    private readonly _isLoading = computed(
        () =>
            this.resource.getFeatureStatus.isLoading() ||
            this.resource.getFeatureCategories.isLoading() ||
            this.resource.getFeatureVoteVariants.isLoading() ||
            this.resource.getFeatureRequests.isLoading() ||
            this.resource.getUserFeatureRequests.isLoading(),
    );

    private readonly _hasError = computed(
        () =>
            !!this.resource.getFeatureStatus.error() ||
            !!this.resource.getFeatureCategories.error() ||
            !!this.resource.getFeatureVoteVariants.error() ||
            !!this.resource.getFeatureRequests.error() ||
            !!this.resource.getUserFeatureRequests.error(),
    );

    constructor() {
        effect(() => {
            const response = this.resource.getFeatureStatus.value();
            if (response?.data) this._featureStatuses.set(response.data);
        });

        effect(() => {
            const response = this.resource.getFeatureCategories.value();
            if (response?.data) this._featureCategories.set(response.data);
        });

        effect(() => {
            const response = this.resource.getFeatureVoteVariants.value();
            if (response?.data) this._featureVoteVariants.set(response.data);
        });

        effect(() => {
            const response = this.resource.getFeatureRequests.value();
            if (response?.data) this._featureRequests.set(response.data);
        });

        effect(() => {
            const response = this.resource.getUserFeatureRequests.value();
            if (response?.data) this._userFeatureRequests.set(response.data);
        });
    }

    getFeatureStatuses(): Signal<IEnumResponse[]> {
        return this._featureStatuses.asReadonly();
    }

    getFeatureCategories(): Signal<IEnumResponse[]> {
        return this._featureCategories.asReadonly();
    }

    getFeatureVoteVariants(): Signal<IEnumResponse[]> {
        return this._featureVoteVariants.asReadonly();
    }

    getFeatureRequests(): Signal<FeaturesWithCount> {
        return this._featureRequests.asReadonly();
    }

    getUserFeatureRequests(): Signal<Feature[]> {
        return this._userFeatureRequests.asReadonly();
    }

    isLoading(): Signal<boolean> {
        return this._isLoading;
    }

    hasError(): Signal<boolean> {
        return this._hasError;
    }

    refreshFeatureRequests(): void {
        this.resource.getFeatureRequests.reload();
    }

    refreshUserFeatureRequests(): void {
        this.resource.getUserFeatureRequests.reload();
    }

    refreshAll(): void {
        this.resource.getFeatureStatus.reload();
        this.resource.getFeatureCategories.reload();
        this.resource.getFeatureVoteVariants.reload();
        this.resource.getFeatureRequests.reload();
        this.resource.getUserFeatureRequests.reload();
    }
}
