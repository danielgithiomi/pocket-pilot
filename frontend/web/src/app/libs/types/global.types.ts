export interface ImageDimensions {
    width: number;
    height: number;
}

type AdditionalLinks = 'support' | 'privacy' | 'faqs_features';
type UserLinks =
    // | 'home'
    'goals' | 'profile' | 'accounts' | 'settings' | 'dashboard' | 'transactions' | 'splitr';

export interface DrawerNavigationLink {
    name: string;
    path: string;
    icon: AdditionalLinks | UserLinks;
}
