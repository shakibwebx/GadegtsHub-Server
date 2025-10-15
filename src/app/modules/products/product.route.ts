import express from 'express';
import { productControllers } from './product.controller';
import validateRequest from '../../middlewares/validateRequest';
import { productValidation } from './product.validation';
import { upload } from '../../config/cloudinary.config';
import { coerceProductTypes } from '../../middlewares/coerceTypes';

const router = express.Router();

//
router.post(
  '/create-product',
  upload.single('image'),
  coerceProductTypes,
  validateRequest(productValidation.createProductZodSchemaValidation),
  productControllers.createProduct,
);
router.get('/', productControllers.getAllProducts);

router.get('/:id', productControllers.getSingleProduct);

router.patch(
  '/:id',
  upload.single('image'),
  coerceProductTypes,
  validateRequest(productValidation.updateProductZodSchemaValidation),
  productControllers.updateProduct,
);

router.delete('/:id', productControllers.deleteProduct);

export const productRoutes = router;
