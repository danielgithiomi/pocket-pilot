export interface ImageDimensions {
  width: number;
  height: number;
}

type AdditionalLinks = 'support';
type UserLinks = 'home' | 'profile' | 'dashboard' | 'accounts' | 'transactions' | 'categories' | 'goals';

export interface DrawerNavigationLink {
  name: string;
  path: string;
  icon: AdditionalLinks | UserLinks;
}
