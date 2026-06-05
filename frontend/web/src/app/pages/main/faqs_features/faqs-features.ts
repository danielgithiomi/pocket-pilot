import { Button } from "@atoms/button";
import { NgClass } from '@angular/common';
import { ContactItem } from '@global/types';
import { RouterLink } from '@angular/router';
import { Accordion } from '@molecules/accordion';
import { LucideAngularModule } from 'lucide-angular';
import { CONTACT_ITEMS, FAQ_ITEMS } from '@global/constants';
import { Component, computed, inject, signal } from '@angular/core';
import { DrawerService } from '@infrastructure/services/drawer.service';

@Component({
    selector: 'faqs-features',
    templateUrl: './faqs-features.html',
    imports: [NgClass, LucideAngularModule, Accordion, RouterLink, Button],
})
export class FaqsFeatures {
    // ICONS
    protected readonly iconSize = 14;

    // SIGNAL STATES
    protected readonly isFeatureFormOpen = signal<boolean>(false);
    protected readonly isLoadingFeatures = signal<boolean>(false);

    // SERVICES
    protected readonly drawerService = inject(DrawerService);

    // DATA
    protected readonly faqItems = FAQ_ITEMS;
    protected readonly contactItems = computed<ContactItem[]>(() =>
        CONTACT_ITEMS.filter((item) => item.id === 'email'),
    );

    // UTILITIES
    protected handleOpenFeatureForm() {
        this.isFeatureFormOpen.set(true);
    }

    protected handleCloseFeatureForm() {
        this.isFeatureFormOpen.set(false);
    }
}
