export interface BreadcrumbInput {
  label: string;
  route: string;
}

export interface BreadcrumbItem extends BreadcrumbInput {
  id: number;
  isLast: boolean;
}
