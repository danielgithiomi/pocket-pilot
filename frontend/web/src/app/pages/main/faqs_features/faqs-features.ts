import { Component } from '@angular/core';
import { Accordion } from '@molecules/accordion';

@Component({
    selector: 'faqs-features',
    templateUrl: './faqs-features.html',
    imports: [Accordion],
})
export class FaqsFeatures {
    protected readonly faqs = [
        {
            id: '1',
            title: 'What is Pocket Pilot?',
            content: 'Pocket Pilot is a tool that helps you manage your finances.',
        },
    ];
}
