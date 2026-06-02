import { Input } from '@atoms/input';
import { Button } from '@atoms/button';
import { TextArea } from '@atoms/text-area';
import { ToastService } from '@atoms/toast';
import { form } from '@angular/forms/signals';
import { AuthService } from '@api/auth.service';
import { PhoneNumber } from '@atoms/phone-number';
import { Component, computed, inject, signal } from '@angular/core';
import { SupportFormSchema, SupportFormValidationSchema } from './support.form';
import { SUPPORT_EMAIL, SUPPORT_PHONE, SUPPORT_INSTAGRAM, SUPPORT_X } from '@global/constants';
import {
    Instagram,
    Twitter,
    LucideAngularModule,
    LucideIconData,
    Mail,
    Phone,
    Send
} from 'lucide-angular';

@Component({
    selector: 'support',
    templateUrl: './support.html',
    imports: [LucideAngularModule, Input, TextArea, PhoneNumber, Button],
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

    // DATA
    private readonly userData = computed(() => {
        const user = this.authService.user();

        if (!user)
            return {
                email: '',
                phone: '',
                lastName: '',
                firstName: '',
            };

        const { email, name, phoneNumber: phone } = user;
        const firstName = name.split(' ')[0];
        const lastName = name.split(' ')[1] ?? '';

        console.log(firstName, lastName, email, phone);

        return { email, firstName, lastName, phone };
    });

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
        message: '',
        ...this.userData(),
    };
    protected readonly supportFormModel = signal<SupportFormSchema>(this.INITIAL_FORM_STATE);
    protected readonly supportForm = form(this.supportFormModel, SupportFormValidationSchema);

    // SUBMIT CONTACT FORM
    protected submitContactForm(event: Event) {
        event.preventDefault();
        console.log('submitContactForm');

        this.isSubmittingForm.set(true);

        setTimeout(() => {
            this.toastService.show({
                variant: 'success',
                title: 'Message sent!',
                details: 'Your message has been sent successfully. We will get back to you as soon as possible.',
            });

            this.isSubmittingForm.set(false);
            this.supportFormModel.set(this.INITIAL_FORM_STATE);
        }, 2000);
    }
}

interface ContactItem {
    id: string;
    link: string;
    value: string;
    icon: LucideIconData;
}
