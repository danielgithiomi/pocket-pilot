import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DrawerService } from '@infrastructure/services';
import { PRIVACY_POLICY_CONTENT } from './privacy-policy.content';
import { afterNextRender, Component, DestroyRef, inject, signal } from '@angular/core';
import {
    Baby,
    Ban,
    Bot,
    Clock,
    Cookie,
    Database,
    Eye,
    Globe,
    Link2,
    Lock,
    LucideAngularModule,
    type LucideIconData,
    Mail,
    Plane,
    RefreshCw,
    Scale,
    Settings,
    Share2,
    Shield,
    TriangleAlert
} from 'lucide-angular';

const SECTION_ICONS: Record<string, LucideIconData> = {
    summary: Eye,
    scope: Globe,
    'information-we-collect': Database,
    'information-we-do-not-collect': Ban,
    'how-we-use-information': Settings,
    'legal-basis': Scale,
    'ai-voice-receipt': Bot,
    'how-we-share-information': Share2,
    'cookies-storage': Cookie,
    'data-retention': Clock,
    security: Lock,
    'breach-notification': TriangleAlert,
    'your-choices': Scale,
    'regional-disclosures': Globe,
    'childrens-privacy': Baby,
    'international-transfers': Plane,
    'third-party-links': Link2,
    changes: RefreshCw,
    'contact-us': Mail
};

@Component({
    selector: 'privacy-policy',
    styleUrl: './privacy-policy.css',
    templateUrl: './privacy-policy.html',
    imports: [NgClass, RouterLink, LucideAngularModule]
})
export class PrivacyPolicy {
    protected readonly iconSize = 16;
    protected readonly heroIconSize = 22;
    protected readonly ShieldIcon = Shield;
    protected readonly LockIcon = Lock;
    protected readonly ImportantIcon = TriangleAlert;

    private readonly destroyRef = inject(DestroyRef);
    protected readonly drawerService = inject(DrawerService);

    protected readonly content = PRIVACY_POLICY_CONTENT;
    protected readonly activeSectionId = signal(this.content.tableOfContents[0]?.id ?? 'summary');

    protected readonly highlightCards = [
        {
            id: 'no-bank-connections',
            icon: Shield,
            title: 'No bank connections',
            description: 'We do not collect banking credentials, card numbers, or brokerage logins.'
        },
        {
            id: 'your-data-stays-yours',
            icon: Lock,
            title: 'Your data stays yours',
            description: 'We do not sell personal information or use finance data for third-party ads.'
        },
        {
            id: 'ai-by-choice',
            icon: Bot,
            title: 'AI by choice',
            description: 'Future voice and receipt features are disabled by default and require explicit consent.'
        }
    ];

    constructor() {
        afterNextRender(() => {
            const sectionElements = this.content.tableOfContents
                .map(item => document.getElementById(item.id))
                .filter((element): element is HTMLElement => element !== null);

            if (!sectionElements.length) return;

            const observer = new IntersectionObserver(
                entries => {
                    const visible = entries
                        .filter(entry => entry.isIntersecting)
                        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

                    if (visible?.target.id) {
                        this.activeSectionId.set(visible.target.id);
                    }
                },
                {
                    rootMargin: '-20% 0px -55% 0px',
                    threshold: [0.1, 0.25, 0.5]
                }
            );

            sectionElements.forEach(element => observer.observe(element));
            this.destroyRef.onDestroy(() => observer.disconnect());
        });
    }

    protected sectionIcon(sectionId: string): LucideIconData {
        return SECTION_ICONS[sectionId] ?? Shield;
    }

    protected scrollToSection(event: Event, sectionId: string) {
        event.preventDefault();

        const section = document.getElementById(sectionId);
        section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        this.activeSectionId.set(sectionId);
    }
}
