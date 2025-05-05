import { NextFunction, Request, Response } from 'express';
import { medicineServices } from './medicine.service';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';
import { MedicineCategory, MedicineType } from './medicine.interface';

const createMedicine = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    // add cloudinary url to body if file exists
    if (req.file) {
      req.body.imageUrl = req.file.path;
    }

    const result = await medicineServices.createMedicineIntoDB(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Medicine is created successfully!',
      data: result,
    });
  },
);

// get all medicines | search and filter medicine
const getAllMedicines = catchAsync(async (req: Request, res: Response) => {
  const {
    searchTerm,
    tags,
    symptoms,
    inStock,
    requiredPrescription,
    minPrice,
    maxPrice,
    type,
    categories,
    page,
    limit,
    sortBy,
    sortOrder,
  } = req.query;
  

  const result = await medicineServices.getAllMedicinesFromDB(
    searchTerm as string,
    tags ? ((Array.isArray(tags) ? tags : [tags]) as string[]) : undefined,
    symptoms
      ? ((Array.isArray(symptoms) ? symptoms : [symptoms]) as string[])
      : undefined,
    inStock !== undefined ? inStock === 'true' : undefined,
    requiredPrescription !== undefined
      ? requiredPrescription === 'true'
      : undefined,
    minPrice ? parseFloat(minPrice as string) : undefined,
    maxPrice ? parseFloat(maxPrice as string) : undefined,
    type as MedicineType,
    categories
      ? ((Array.isArray(categories)
          ? categories
          : [categories]) as MedicineCategory[])
      : undefined,
    page ? parseInt(page as string) : undefined,
    limit ? parseInt(limit as string) : undefined,
    sortBy as string,
    sortOrder as 'asc' | 'desc' | undefined,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Medicines retrieved successfully!',
    data: result,
  });
});

// get a single medicine
const getSingleMedicine = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await medicineServices.getSingleMedicinesFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Medicine retrieved successfully!',
    data: result,
  });
});

// update a single medicine
// const updateMedicine = catchAsync(async (req: Request, res: Response) => {
//   const id = req.params.id;
//   const body = req.body;
//   const result = await medicineServices.updateMedicineIntoDB(id, body);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Medicine updated successfully!',
//     data: result,
//   });
// });
const updateMedicine = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const body = req.body;

  // update imageUrl if new file is uploaded
  if (req.file) {
    body.imageUrl = req.file.path;
  }

  const result = await medicineServices.updateMedicineIntoDB(id, body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Medicine updated successfully!',
    data: result,
  });
});

// delete a medicine
const deleteMedicine = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await medicineServices.deleteMedicineFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Medicine Deleted successfully!',
    data: result,
  });
});


export const medicineControllers = {
  createMedicine,
  getAllMedicines,
  getSingleMedicine,
  updateMedicine,
  deleteMedicine,
};
