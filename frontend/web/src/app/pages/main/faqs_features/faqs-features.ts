import { Button } from '@atoms/button';
import { NgClass } from '@angular/common';
import { ToastService } from '@atoms/toast';
import { RouterLink } from '@angular/router';
import { Accordion } from '@molecules/accordion';
import { ContactItem, Feature } from '@global/types';
import { LucideAngularModule } from 'lucide-angular';
import { TabList, TabListItem } from '@atoms/tab-list';
import { FeaturesService } from '@api/features.service';
import { NoData } from '@structural/main/no-data/no-data';
import { CONTACT_ITEMS, FAQ_ITEMS } from '@global/constants';
import { Component, computed, inject, signal } from '@angular/core';
import { FetchError } from '@structural/main/fetch-error/fetch-error';
import { DrawerService } from '@infrastructure/services/drawer.service';
import { FeatureItem } from '@structural/main/feature-item/feature-item';
import { FeatureDetails } from '@pages/main/faqs_features/feature-details';
import { SuggestFeatureForm } from '@pages/main/faqs_features/feature-form';

@Component({
    selector: 'faqs-features',
    styleUrl: './faqs-features.css',
    templateUrl: './faqs-features.html',
    imports: [
        Button,
        NoData,
        NgClass,
        TabList,
        Accordion,
        RouterLink,
        FetchError,
        FeatureItem,
        FeatureDetails,
        SuggestFeatureForm,
        LucideAngularModule
    ]
})
export class FaqsFeatures {
    // ICONS
    protected readonly iconSize = 14;

    // ANIMATIONS
    protected readonly animationDimensions = '180px';
    protected readonly animationMessageSize = 'text-xs';

    // SIGNAL STATES
    protected readonly activeTabIndex = signal<0 | 1>(0);
    protected readonly isFeatureFormOpen = signal<boolean>(false);
    protected readonly isFeatureModalOpen = signal<boolean>(false);
    protected readonly selectedFeature = signal<Feature | null>(null);

    // SERVICES
    protected readonly toastService = inject(ToastService);
    protected readonly drawerService = inject(DrawerService);
    protected readonly featuresService = inject(FeaturesService);

    // DATA
    protected readonly faqItems = FAQ_ITEMS;
    protected readonly contactItems = computed<ContactItem[]>(() => CONTACT_ITEMS.filter(item => item.id === 'email'));

    // STORE
    private readonly featureStatuses = this.featuresService.getFeatureStatuses();
    protected readonly featureRequests = this.featuresService.getFeatureRequests();
    private readonly featureCategories = this.featuresService.getFeatureCategories();
    private readonly userFeatureRequests = this.featuresService.getUserFeatureRequests();
    private readonly featureVoteVariants = this.featuresService.getFeatureVoteVariants();

    // COMPUTED
    protected readonly hasFeaturesError = this.featuresService.hasError();
    protected readonly isLoadingFeatures = this.featuresService.isLoading();
    protected readonly tabItems = computed<TabListItem[]>(() => [
        {
            value: 'all',
            label: `All Suggestions [${this.featureRequests().count}]`
        },
        {
            value: 'personal',
            label: 'My Suggestions'
        }
    ]);
    protected readonly displayFeatures = computed<Feature[]>(() =>
        this.activeTabIndex() === 0 ? this.featureRequests().features : this.userFeatureRequests()
    );
    protected readonly featuresSubtitle = computed<string>(() => {
        const allSubtitle = 'Most Popular Feature Requests';
        const personalSubtitle = 'My Suggested Feature Requests';

        return this.activeTabIndex() === 0 ? allSubtitle : personalSubtitle;
    });

    // UTILITIES
    protected onTabSelected(index: number) {
        this.activeTabIndex.set(index as 0 | 1);
    }

    protected handleOpenFeatureForm() {
        this.isFeatureFormOpen.set(true);
    }

    protected handleCloseFeatureForm(reload: boolean) {
        if (reload) this.featuresService.refreshAll();
        this.isFeatureFormOpen.set(false);
    }

    protected handleOnFeatureItemClick(featureId: string) {
        const feature = this.featureRequests().features.find(f => f.id === featureId);

        if (!feature) {
            this.toastService.show({
                variant: 'error',
                title: 'Error Fetching Feature!',
                details: 'There was an unexpected error fetching the selected feature details.'
            });
            return;
        }

        this.selectedFeature.set(feature);
        this.isFeatureModalOpen.set(true);
    }

    protected handleOnFeatureModalClose() {
        this.selectedFeature.set(null);
        this.isFeatureModalOpen.set(false);
    }
}
