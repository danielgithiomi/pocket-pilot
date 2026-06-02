import { Component } from '@angular/core';
import { SUPPORT_EMAIL, SUPPORT_PHONE, SUPPORT_INSTAGRAM, SUPPORT_TIKTOK, SUPPORT_X } from '@global/constants';
import { Instagram, Twitter, LucideAngularModule, LucideIconData, Mail, Phone } from 'lucide-angular';

@Component({
    selector: 'support',
    templateUrl: './support.html',
    imports: [LucideAngularModule],
})
export class Support {


    // ICONS
    protected readonly iconSize = 15;

    // CONTACT ITEMS
    protected readonly contactItems: ContactItem[] = [
        {
            id: 'email',
            icon: Mail,
            value: SUPPORT_EMAIL,
            link: `mailto:${SUPPORT_EMAIL}`,
        },
        {
            id: 'phone',
            icon: Phone,
            value: SUPPORT_PHONE,
            link: `tel:${SUPPORT_PHONE}`,
        },
        {
            id: 'tiktok',
            icon: Twitter,
            value: SUPPORT_X,
            link: `https://x.com/${SUPPORT_X}`,
        },
        {
            id: 'instagram',
            icon: Instagram,
            value: SUPPORT_INSTAGRAM,
            link: `https://www.instagram.com/${SUPPORT_INSTAGRAM}`,
        },
    ].reverse();
}

interface ContactItem {
    id: string;
    link: string;
    value: string;
    icon: LucideIconData;
}