export interface ImageDimensions {
  width: number;
  height: number;
}

export interface DrawerNavigationLink {
  icon: 'home' | 'profile' | 'dashboard' | 'accounts' | 'transactions';
  name: string;
  path: string;
}
