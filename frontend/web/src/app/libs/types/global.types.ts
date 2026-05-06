export interface ImageDimensions {
  width: number;
  height: number;
}

type AdditionalLinks = 'support';
type UserLinks =
  // | 'home'
  'goals' | 'profile' | 'accounts' | 'settings' | 'dashboard' | 'transactions' | 'splitter';

export interface DrawerNavigationLink {
  name: string;
  path: string;
  icon: AdditionalLinks | UserLinks;
}
