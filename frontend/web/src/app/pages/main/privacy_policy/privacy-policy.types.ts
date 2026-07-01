export type PrivacyCalloutVariant = 'info' | 'warning' | 'accent';

export interface PrivacyPolicyCallout {
    title: string;
    text: string;
    variant: PrivacyCalloutVariant;
}

export interface PrivacyPolicyTable {
    headers: string[];
    rows: string[][];
}

export interface PrivacyPolicySubsection {
    id: string;
    title: string;
    paragraphs?: string[];
    closingParagraphs?: string[];
    bullets?: string[];
    table?: PrivacyPolicyTable;
}

export interface PrivacyPolicySection {
    id: string;
    title: string;
    paragraphs?: string[];
    closingParagraphs?: string[];
    bullets?: string[];
    subsections?: PrivacyPolicySubsection[];
    callout?: PrivacyPolicyCallout;
    table?: PrivacyPolicyTable;
}

export interface PrivacyPolicyTocItem {
    id: string;
    title: string;
    shortTitle: string;
    number: number;
}

export interface PrivacyPolicyContact {
    name: string;
    email: string;
    emailLink: string;
    github: string;
    githubLink: string;
    website: string;
    websiteLink: string;
}

export interface PrivacyPolicyContent {
    title: string;
    effectiveDate: string;
    lastUpdated: string;
    intro: string[];
    importantNotice: string;
    disagreementNotice: string;
    summaryBullets: string[];
    tableOfContents: PrivacyPolicyTocItem[];
    sections: PrivacyPolicySection[];
    contact: PrivacyPolicyContact;
}
