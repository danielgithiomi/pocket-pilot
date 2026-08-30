import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Input } from '@atoms/input';
import { Button } from '@atoms/button';
import { TextArea } from '@atoms/text-area';
import { ToastService } from '@atoms/toast';
import { form } from '@angular/forms/signals';
import { AuthService } from '@api/auth.service';
import { buildFullPhoneNumber, parsePhoneNumber, PhoneNumber } from '@atoms/phone-number';
import { DrawerService } from '@infrastructure/services';
import { LucideAngularModule, Send } from 'lucide-angular';
import { Component, computed, inject, signal } from '@angular/core';
import { CONTACT_ITEMS, DEFAULT_COUNTRY_ISO } from '@shared/constants';
import { SupportFormSchema, SupportFormValidationSchema } from './support.form';

@Component({
    selector: 'support',
    templateUrl: './support.html',
    imports: [NgClass, RouterLink, LucideAngularModule, Input, TextArea, PhoneNumber, Button]
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
    protected readonly contactItems = CONTACT_ITEMS;
    private readonly userData = computed(() => {
        const user = this.authService.user();

        if (!user) {
            return {
                email: '',
                phone: '',
                lastName: '',
                firstName: '',
                phoneCountryIso: DEFAULT_COUNTRY_ISO
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
            phone: buildFullPhoneNumber(country, nationalNumber)
        };
    });

    protected readonly defaultPhoneCountryIso = computed(() => this.userData().phoneCountryIso);

    // FORM
    private getInitialFormState(): SupportFormSchema {
        const { email, phone, lastName, firstName } = this.userData();

        return {
            message: '',
            email,
            phone,
            lastName,
            firstName
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
                details: 'Your message has been sent successfully. We will get back to you as soon as possible.'
            });

            this.isSubmittingForm.set(false);
            this.supportFormModel.set(this.getInitialFormState());
        }, 2000);
    }
}
