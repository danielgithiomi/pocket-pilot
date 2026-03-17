export interface ImageDimensions {
  width: number;
  height: number;
}

export interface DrawerNavigationLink {
  icon: 'home' | 'profile' | 'dashboard' | 'accounts';
  name: string;
  path: string;
}
