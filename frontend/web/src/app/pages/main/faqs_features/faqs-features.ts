import { NgClass } from '@angular/common';
import { Accordion } from '@molecules/accordion';
import { Component, inject } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { CONTACT_ITEMS, FAQ_ITEMS } from '@global/constants';
import { DrawerService } from '@infrastructure/services/drawer.service';

@Component({
    selector: 'faqs-features',
    templateUrl: './faqs-features.html',
    imports: [NgClass, LucideAngularModule, Accordion],
})
export class FaqsFeatures {
    // ICONS
    protected readonly iconSize = 14;

    // SERVICES
    protected readonly drawerService = inject(DrawerService);

    // DATA
    protected readonly faqItems = FAQ_ITEMS;
    protected readonly contactItems = CONTACT_ITEMS;
}
