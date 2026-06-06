import { Button } from '@atoms/button';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Accordion } from '@molecules/accordion';
import { ContactItem, Feature } from '@global/types';
import { LucideAngularModule } from 'lucide-angular';
import { TabList, TabListItem } from '@atoms/tab-list';
import { FeaturesService } from '@api/features.service';
import { CONTACT_ITEMS, FAQ_ITEMS } from '@global/constants';
import { Component, computed, inject, signal } from '@angular/core';
import { DrawerService } from '@infrastructure/services/drawer.service';
import { FeatureItem } from '@structural/main/feature-item/feature-item';

@Component({
    selector: 'faqs-features',
    styleUrl: './faqs-features.css',
    templateUrl: './faqs-features.html',
    imports: [NgClass, LucideAngularModule, Accordion, RouterLink, Button, TabList, FeatureItem],
})
export class FaqsFeatures {
    // ICONS
    protected readonly iconSize = 14;

    // SIGNAL STATES
    protected readonly activeTabIndex = signal<0 | 1>(0);
    protected readonly isFeatureFormOpen = signal<boolean>(false);

    // SERVICES
    protected readonly drawerService = inject(DrawerService);
    protected readonly featuresService = inject(FeaturesService);

    // DATA
    protected readonly faqItems = FAQ_ITEMS;
    protected readonly contactItems = computed<ContactItem[]>(() =>
        CONTACT_ITEMS.filter((item) => item.id === 'email'),
    );

    // STORE
    private readonly featureStatuses = this.featuresService.getFeatureStatuses();
    private readonly featureRequests = this.featuresService.getFeatureRequests();
    private readonly featureCategories = this.featuresService.getFeatureCategories();
    private readonly featureVoteVariants = this.featuresService.getFeatureVoteVariants();
    private readonly userFeatureRequests = this.featuresService.getUserFeatureRequests();

    // COMPUTED
    protected readonly isLoadingFeatures = this.featuresService.isLoading();
    protected readonly hasFeaturesError = this.featuresService.hasError();
    protected readonly tabItems = computed<TabListItem[]>(() => [
        {
            value: 'all',
            label: 'All Requests',
        },
        {
            value: 'personal',
            label: 'My Requests',
        },
    ]);
    protected readonly displayFeatures = computed<Feature[]>(() =>
        this.activeTabIndex() === 0 ? this.featureRequests().features : this.userFeatureRequests(),
    );

    // UTILITIES
    protected handleOpenFeatureForm() {
        this.isFeatureFormOpen.set(true);
    }

    protected handleCloseFeatureForm() {
        this.isFeatureFormOpen.set(false);
    }

    protected onTabSelected(index: number) {
        this.activeTabIndex.set(index as 0 | 1);
    }
}
