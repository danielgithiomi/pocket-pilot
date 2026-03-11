export interface ImageDimensions {
  width: number;
  height: number;
}

export interface DrawerNavigationLink {
  icon: 'home' | 'profile' | 'dashboard';
  name: string;
  path: string;
}
