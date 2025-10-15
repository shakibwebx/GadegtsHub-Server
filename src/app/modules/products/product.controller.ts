import { NextFunction, Request, Response } from 'express';
import { productServices } from './product.service';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';
import { ProductCategory, ProductType } from './product.interface';

const createProduct = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    // add cloudinary url to body if file exists
    if (req.file) {
      req.body.imageUrl = req.file.path;
    }

    const result = await productServices.createProductIntoDB(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Product is created successfully!',
      data: result,
    });
  },
);

// get all products | search and filter products
const getAllProducts = catchAsync(async (req: Request, res: Response) => {
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


  const result = await productServices.getAllProductsFromDB(
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
    type as ProductType,
    categories
      ? ((Array.isArray(categories)
          ? categories
          : [categories]) as ProductCategory[])
      : undefined,
    page ? parseInt(page as string) : undefined,
    limit ? parseInt(limit as string) : undefined,
    sortBy as string,
    sortOrder as 'asc' | 'desc' | undefined,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Products retrieved successfully!',
    data: result,
  });
});

// get a single product
const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await productServices.getSingleProductFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product retrieved successfully!',
    data: result,
  });
});

// update a single product
const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const body = req.body;

  // update imageUrl if new file is uploaded
  if (req.file) {
    body.imageUrl = req.file.path;
  }

  const result = await productServices.updateProductIntoDB(id, body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product updated successfully!',
    data: result,
  });
});

// delete a product
const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await productServices.deleteProductFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product Deleted successfully!',
    data: result,
  });
});


export const productControllers = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
