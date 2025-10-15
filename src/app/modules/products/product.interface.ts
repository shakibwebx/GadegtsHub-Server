export type ProductType =
  | 'Smartwatch'
  | 'Smartphone'
  | 'Laptop'
  | 'PC'
  | 'Airbuds'
  | 'Camera';

export type ProductCategory =
  | 'Watch'
  | 'Phone'
  | 'Macbook'
  | 'Computer'
  | 'Headphones'
  | 'DSLR'
  | 'mouse'
  | 'keyboard'
  | 'monitor'

export interface IProduct {
  id?: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  requiredPrescription: boolean;
  manufacturer: string;
  expiryDate: Date;
  type: ProductType;
  categories: ProductCategory[];
  symptoms?: string[];
  discount?: number;
  imageUrl?: string;
  supplier?: string;
  inStock: boolean;
  isDeleted: boolean;
  sku?: string;
  tags?: string[];
  createdAt: string;
}
