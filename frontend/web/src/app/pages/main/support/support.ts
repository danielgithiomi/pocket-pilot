import { Input } from '@atoms/input';
import { Component, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { PhoneNumber } from "@atoms/phone-number";
import { SupportFormSchema, SupportFormValidationSchema } from './support.form';
import { SUPPORT_EMAIL, SUPPORT_PHONE, SUPPORT_INSTAGRAM, SUPPORT_X } from '@global/constants';
import {
    Instagram,
    Twitter,
    LucideAngularModule,
    LucideIconData,
    Mail,
    Phone,
} from 'lucide-angular';

@Component({
    selector: 'support',
    templateUrl: './support.html',
    imports: [LucideAngularModule, Input, PhoneNumber],
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

    // FORM
    private readonly INITIAL_FORM_STATE: SupportFormSchema = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
    };
    protected readonly supportFormModel = signal<SupportFormSchema>(this.INITIAL_FORM_STATE);
    protected readonly supportForm = form(this.supportFormModel, SupportFormValidationSchema);

    // SUBMIT CONTACT FORM
    protected submitContactForm(event: Event) {
        event.preventDefault();
        console.log('submitContactForm');
    }
}

interface ContactItem {
    id: string;
    link: string;
    value: string;
    icon: LucideIconData;
}
