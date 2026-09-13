export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface MenuSection {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
}
