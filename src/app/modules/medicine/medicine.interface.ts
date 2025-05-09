export type MedicineType =
  | 'Smartwatch'
  | 'Smartphone'
  | 'Laptop'
  | 'PC'
  | 'Airbuds'
  | 'Camera';

export type MedicineCategory =
  | 'Watch'
  | 'Phone'
  | 'Macbook'
  | 'Computer'
  | 'Headphones'
  | 'DSLR'
  | 'mouse'
  | 'keyboard'
  | 'monitor'

export interface IMedicine {
  id?: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  requiredPrescription: boolean;
  manufacturer: string;
  expiryDate: Date;
  type: MedicineType;
  categories: MedicineCategory[];
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

// export interface IMedicine {
//   id?: string;
//   name: string;
//   description?: string;
//   price: number;
//   quantity: number;
//   requiredPrescription: boolean;
//   manufacturer: string;
//   expiryDate: Date;
//   createdAt: Date;
//   updatedAt: Date;
//   type: MedicineType;
//   category: MedicineCategory;
//   symptoms?: string[];
//   discount?: number;
//   imageUrl?: string;
//   supplier?: string;
//   inStock: boolean;
//   isDeleted: boolean;
// }
