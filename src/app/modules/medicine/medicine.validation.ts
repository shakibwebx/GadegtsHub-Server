import { z } from 'zod';

const MedicineTypeEnum = z.enum([
  'Smartwatch',
  'Smartphone',
  'Laptop',
  'PC',
  'Airbuds',
  'Camera',
]);

const MedicineCategoryEnum = z.enum([
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

const createMedicineZodSchemaValidation = z.object({
  name: z.string().min(1, 'Medicine name is required'),
  description: z.string().optional(),
  price: z.number().nonnegative('Price cannot be negative'),
  quantity: z.number().nonnegative('Quantity cannot be negative'),
  requiredPrescription: z.boolean(),
  manufacturer: z.string().min(1, 'Manufacturer is required'),
  expiryDate: z.coerce.date(),
  type: MedicineTypeEnum,
  categories: z
    .array(MedicineCategoryEnum)
    .nonempty('At least one category is required'),
  symptoms: z.array(z.string()).optional(),
  discount: z.number().nonnegative().optional().default(0),
  imageUrl: z.string().url('Must be a valid image URL').optional(),
  supplier: z.string().optional(),
  inStock: z.boolean(),
  isDeleted: z.boolean().optional(),
  sku: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const updateMedicineZodSchemaValidation = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().nonnegative().optional(),
  quantity: z.number().nonnegative().optional(),
  requiredPrescription: z.boolean().optional(),
  manufacturer: z.string().min(1).optional(),
  expiryDate: z.coerce.date().optional(),
  type: MedicineTypeEnum.optional(),
  categories: z.array(MedicineCategoryEnum).optional(),
  symptoms: z.array(z.string()).optional(),
  discount: z.number().nonnegative().optional(),
  imageUrl: z.string().url().optional(),
  supplier: z.string().optional(),
  inStock: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  sku: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const medicineValidation = {
  createMedicineZodSchemaValidation,
  updateMedicineZodSchemaValidation,
};
