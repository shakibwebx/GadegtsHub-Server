import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import {
  IProduct,
  ProductCategory,
  ProductType,
} from './product.interface';
import { Product } from './product.model';
import { FilterQuery } from 'mongoose';

// create a product into db
const createProductIntoDB = async (payload: IProduct) => {
  const exists = await Product.findOne({
    name: payload.name,
    manufacturer: payload.manufacturer,
    type: payload.type,
    categories: { $all: payload.categories },
    sku: payload.sku,
    isDeleted: false,
  });

  if (exists) {
    throw new AppError(httpStatus.CONFLICT, 'This product already exists!');
  }

  const result = await Product.create(payload);
  return result;
};

// get all products from db
const getAllProductsFromDB = async (
  searchTerm?: string,
  tags?: string[],
  symptoms?: string[],
  inStock?: boolean,
  requiredPrescription?: boolean,
  minPrice?: number,
  maxPrice?: number,
  type?: ProductType,
  categories?: ProductCategory[],
  page: number = 1,
  limit: number = 10,
  sortBy: string = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc',
) => {
  const filter: FilterQuery<IProduct> = { isDeleted: false };

  // searchTerm
  if (searchTerm) {
    filter.$or = [
      { name: { $regex: searchTerm, $options: 'i' } },
      { categories: { $elemMatch: { $regex: searchTerm, $options: 'i' } } },
      { tags: { $elemMatch: { $regex: searchTerm, $options: 'i' } } },
      { symptoms: { $elemMatch: { $regex: searchTerm, $options: 'i' } } },
      { type: { $regex: searchTerm, $options: 'i' } },
      { manufacturer: { $regex: searchTerm, $options: 'i' } },
    ];
  }




  // tag
  if (tags && tags.length > 0) {
    filter.tags = { $in: tags };
  }

  // symptom
  if (symptoms && symptoms.length > 0) {
    filter.symptoms = { $in: symptoms };
  }

  if (inStock !== undefined) filter.inStock = inStock;
  if (requiredPrescription !== undefined)
    filter.requiredPrescription = requiredPrescription;

  if (type) filter.type = type;
  if (categories && categories.length > 0) {
    filter.categories = { $in: categories };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = minPrice;
    if (maxPrice !== undefined) filter.price.$lte = maxPrice;
  }

  const skip = (page - 1) * limit;

  const sortOptions: Record<string, 1 | -1> = {};
  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const products = await Product.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(filter);

  return {
    data: products,
    meta: {
      total,
      page,
      limit,
    },
  };
};

// get a single product from db
const getSingleProductFromDB = async (id: string) => {
  const result = await Product.findById(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found!');
  }

  return result;
};

// update product
const updateProductIntoDB = async (
  id: string,
  payload: Partial<IProduct>,
) => {
  const result = await Product.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found!');
  }

  return result;
};

// soft delete
const deleteProductFromDB = async (id: string) => {
  const deletedProduct = await Product.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!deletedProduct) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Product');
  }

  return deletedProduct;
};

export const productServices = {
  createProductIntoDB,
  getAllProductsFromDB,
  getSingleProductFromDB,
  updateProductIntoDB,
  deleteProductFromDB,
};
