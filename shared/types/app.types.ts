import { LucideIconData } from "lucide-angular";

export interface LabelValueItem {
    value: string;
    label: string;
    descriptor?: string;
}

export interface ContactItem {
    id: string;
    link: string;
    value: string;
    icon: LucideIconData;
}

export interface AccordionItem {
    id: string;
    title: string;
    content: string;
}