import { NgClass } from '@angular/common';
import { Accordion } from '@molecules/accordion';
import { Component, computed, inject } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { CONTACT_ITEMS, FAQ_ITEMS } from '@global/constants';
import { DrawerService } from '@infrastructure/services/drawer.service';
import { RouterLink } from '@angular/router';
import { ContactItem } from '@global/types';

@Component({
    selector: 'faqs-features',
    templateUrl: './faqs-features.html',
    imports: [NgClass, LucideAngularModule, Accordion, RouterLink],
})
export class FaqsFeatures {
    // ICONS
    protected readonly iconSize = 14;

    // SERVICES
    protected readonly drawerService = inject(DrawerService);

    // DATA
    protected readonly faqItems = FAQ_ITEMS;
    protected readonly contactItems = computed<ContactItem[]>(() =>
        CONTACT_ITEMS.filter((item) => item.id === 'email'),
    );
}
