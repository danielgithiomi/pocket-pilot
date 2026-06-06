import { Button } from '@atoms/button';
import { NgClass } from '@angular/common';
import { ContactItem } from '@global/types';
import { RouterLink } from '@angular/router';
import { Accordion } from '@molecules/accordion';
import { LucideAngularModule } from 'lucide-angular';
import { TabList, TabListItem } from '@atoms/tab-list';
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
    protected readonly activeTabIndex = signal<number>(0);
    protected readonly isFeatureFormOpen = signal<boolean>(false);
    protected readonly isLoadingFeatures = signal<boolean>(false);

    // SERVICES
    protected readonly drawerService = inject(DrawerService);

    // DATA
    protected readonly faqItems = FAQ_ITEMS;
    protected readonly contactItems = computed<ContactItem[]>(() =>
        CONTACT_ITEMS.filter((item) => item.id === 'email'),
    );

    // COMPUTED
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

    // UTILITIES
    protected handleOpenFeatureForm() {
        this.isFeatureFormOpen.set(true);
    }

    protected handleCloseFeatureForm() {
        this.isFeatureFormOpen.set(false);
    }

    protected onTabSelected(index: number) {
        this.activeTabIndex.set(index);
    }
}
