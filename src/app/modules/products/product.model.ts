import mongoose, { Schema } from 'mongoose';
import { IProduct } from './product.interface';

const productSchema: Schema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: 0,
    },
    requiredPrescription: {
      type: Boolean,
      required: true,
    },
    manufacturer: {
      type: String,
      required: [true, 'Manufacturer name is required'],
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
    type: {
      type: String,
      required: [true, 'Product type is required'],
      enum: ['Smartwatch', 'Smartphone', 'Laptop', 'PC', 'Airbuds', 'Camera'],
    },
    categories: {
      type: [String],
      required: [true, 'At least one category is required'],
      enum: [
        'Watch',
        'Phone',
        'Macbook',
        'Computer',
        'Headphones',
        'DSLR',
        'mouse',
        'keyboard',
        'monitor',
      ],
    },
    symptoms: {
      type: [String],
    },
    discount: {
      type: Number,
      default: 0,
    },
    imageUrl: {
      type: String,
    },
    supplier: {
      type: String,
    },
    inStock: {
      type: Boolean,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    sku: {
      type: String,
    },
    tags: {
      type: [String],
    },
  },
  { timestamps: true },
);

// soft delete
// filter out deleted documents
productSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

productSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

productSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

//checking if a product is already exist!
//

export const Product = mongoose.model<IProduct>('Product', productSchema);
