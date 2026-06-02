import { Input } from '@atoms/input';
import { Button } from '@atoms/button';
import { NgClass } from '@angular/common';
import { TextArea } from '@atoms/text-area';
import { ToastService } from '@atoms/toast';
import { form } from '@angular/forms/signals';
import { AuthService } from '@api/auth.service';
import { PhoneNumber } from '@atoms/phone-number';
import { DEFAULT_COUNTRY_ISO } from '@global/constants';
import { DrawerService } from '@infrastructure/services';
import { Component, computed, inject, signal } from '@angular/core';
import { buildFullPhoneNumber, parsePhoneNumber } from '@atoms/phone-number';
import { SupportFormSchema, SupportFormValidationSchema } from './support.form';
import { SUPPORT_EMAIL, SUPPORT_PHONE, SUPPORT_INSTAGRAM, SUPPORT_X } from '@global/constants';
import {
    Mail,
    Send,
    Phone,
    Twitter,
    Instagram,
    LucideIconData,
    LucideAngularModule,
} from 'lucide-angular';

@Component({
    selector: 'support',
    templateUrl: './support.html',
    imports: [NgClass, LucideAngularModule, Input, TextArea, PhoneNumber, Button],
})
export class Support {
    // ICONS
    protected readonly iconSize = 14;
    protected readonly SendIcon = Send;

    // SIGNALS
    protected readonly isSubmittingForm = signal(false);

    // SERVICES
    private readonly authService = inject(AuthService);
    private readonly toastService = inject(ToastService);
    protected readonly drawerService = inject(DrawerService);

    // DATA
    private readonly userData = computed(() => {
        const user = this.authService.user();

        if (!user) {
            return {
                email: '',
                phone: '',
                lastName: '',
                firstName: '',
                phoneCountryIso: DEFAULT_COUNTRY_ISO,
            };
        }

        const { email, name, phoneNumber } = user;
        const nameParts = name.trim().split(/\s+/);
        const firstName = nameParts[0] ?? '';
        const lastName = nameParts.slice(1).join(' ');
        const { country, nationalNumber } = parsePhoneNumber(phoneNumber, DEFAULT_COUNTRY_ISO);

        return {
            email,
            firstName,
            lastName,
            phoneCountryIso: country.iso,
            phone: buildFullPhoneNumber(country, nationalNumber),
        };
    });

    protected readonly defaultPhoneCountryIso = computed(() => this.userData().phoneCountryIso);

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
    private getInitialFormState(): SupportFormSchema {
        const { email, phone, lastName, firstName } = this.userData();

        return {
            message: '',
            email,
            phone,
            lastName,
            firstName,
        };
    }

    protected readonly supportFormModel = signal<SupportFormSchema>(this.getInitialFormState());
    protected readonly supportForm = form(this.supportFormModel, SupportFormValidationSchema);

    // SUBMIT CONTACT FORM
    protected submitContactForm(event: Event) {
        event.preventDefault();

        this.isSubmittingForm.set(true);

        setTimeout(() => {
            this.toastService.show({
                variant: 'success',
                title: 'Message sent!',
                details:
                    'Your message has been sent successfully. We will get back to you as soon as possible.',
            });

            this.isSubmittingForm.set(false);
            this.supportFormModel.set(this.getInitialFormState());
        }, 2000);
    }
}

interface ContactItem {
    id: string;
    link: string;
    value: string;
    icon: LucideIconData;
}
