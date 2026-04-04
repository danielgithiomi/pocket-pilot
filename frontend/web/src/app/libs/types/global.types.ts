export interface ImageDimensions {
  width: number;
  height: number;
}

export interface DrawerNavigationLink {
  icon: 'home' | 'profile' | 'dashboard' | 'accounts' | 'transactions' | 'categories' | 'support';
  name: string;
  path: string;
}
