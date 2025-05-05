import express from 'express';
import { medicineControllers } from './medicine.controller';
import validateRequest from '../../middlewares/validateRequest';
import { medicineValidation } from './medicine.validation';
import { upload } from '../../config/cloudinary.config';
import { coerceMedicineTypes } from '../../middlewares/coerceTypes';

const router = express.Router();

//
router.post(
  '/create-medicine',
  upload.single('image'),
  coerceMedicineTypes,
  validateRequest(medicineValidation.createMedicineZodSchemaValidation),
  medicineControllers.createMedicine,
);
router.get('/', medicineControllers.getAllMedicines);

router.get('/:id', medicineControllers.getSingleMedicine);

router.patch(
  '/:id',
  upload.single('image'),
  coerceMedicineTypes,
  validateRequest(medicineValidation.updateMedicineZodSchemaValidation),
  medicineControllers.updateMedicine,
);

router.delete('/:id', medicineControllers.deleteMedicine);

export const medicineRoutes = router;
