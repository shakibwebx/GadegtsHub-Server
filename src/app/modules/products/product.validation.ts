import { z } from 'zod';

const ProductTypeEnum = z.enum([
  'Smartwatch',
  'Smartphone',
  'Laptop',
  'PC',
  'Airbuds',
  'Camera',
]);

const ProductCategoryEnum = z.enum([
  'Watch',
  'Phone',
  'Macbook',
  'Computer',
  'Headphones',
  'DSLR',
  'mouse',
  'keyboard',
  'monitor',
]);

const createProductZodSchemaValidation = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().nonnegative('Price cannot be negative'),
  quantity: z.number().nonnegative('Quantity cannot be negative'),
  requiredPrescription: z.boolean(),
  manufacturer: z.string().min(1, 'Manufacturer is required'),
  expiryDate: z.coerce.date(),
  type: ProductTypeEnum,
  categories: z
    .array(ProductCategoryEnum)
    .nonempty('At least one category is required'),
  symptoms: z.array(z.string()).optional(),
  discount: z.number().nonnegative().optional().default(0),
  imageUrl: z.string().optional(),
  supplier: z.string().optional(),
  inStock: z.boolean(),
  isDeleted: z.boolean().optional(),
  sku: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const updateProductZodSchemaValidation = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().nonnegative().optional(),
  quantity: z.number().nonnegative().optional(),
  requiredPrescription: z.boolean().optional(),
  manufacturer: z.string().min(1).optional(),
  expiryDate: z.coerce.date().optional(),
  type: ProductTypeEnum.optional(),
  categories: z.array(ProductCategoryEnum).optional(),
  symptoms: z.array(z.string()).optional(),
  discount: z.number().nonnegative().optional(),
  imageUrl: z.string().optional(),
  supplier: z.string().optional(),
  inStock: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  sku: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const productValidation = {
  createProductZodSchemaValidation,
  updateProductZodSchemaValidation,
};
