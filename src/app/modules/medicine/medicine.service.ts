import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import {
  IMedicine,
  MedicineCategory,
  MedicineType,
} from './medicine.interface';
import { Medicine } from './medicine.model';
import { FilterQuery } from 'mongoose';

// create a medicine into db
const createMedicineIntoDB = async (payload: IMedicine) => {
  const exists = await Medicine.findOne({
    name: payload.name,
    manufacturer: payload.manufacturer,
    type: payload.type,
    categories: { $all: payload.categories },
    sku: payload.sku,
    isDeleted: false,
  });

  if (exists) {
    throw new AppError(httpStatus.CONFLICT, 'This medicine already exists!');
  }

  const result = await Medicine.create(payload);
  return result;
};

// get all medicines from db
const getAllMedicinesFromDB = async (
  searchTerm?: string,
  tags?: string[],
  symptoms?: string[],
  inStock?: boolean,
  requiredPrescription?: boolean,
  minPrice?: number,
  maxPrice?: number,
  type?: MedicineType,
  categories?: MedicineCategory[],
  page: number = 1,
  limit: number = 10,
  sortBy: string = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc',
) => {
  const filter: FilterQuery<IMedicine> = { isDeleted: false };

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

  const medicines = await Medicine.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  const total = await Medicine.countDocuments(filter);

  return {
    data: medicines,
    meta: {
      total,
      page,
      limit,
    },
  };
};

// get a single medicines from db
const getSingleMedicinesFromDB = async (id: string) => {
  const result = await Medicine.findById(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Medicine not found!');
  }

  return result;
};

// update medicine
const updateMedicineIntoDB = async (
  id: string,
  payload: Partial<IMedicine>,
) => {
  const result = await Medicine.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Medicine not found!');
  }

  return result;
};

// soft delete
const deleteMedicineFromDB = async (id: string) => {
  const deletedMedicine = await Medicine.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!deletedMedicine) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Medicine');
  }

  return deletedMedicine;
};

export const medicineServices = {
  createMedicineIntoDB,
  getAllMedicinesFromDB,
  getSingleMedicinesFromDB,
  updateMedicineIntoDB,
  deleteMedicineFromDB,
};
