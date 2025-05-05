import { Request, Response, NextFunction } from 'express';

export const coerceMedicineTypes = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const body = req.body;

  // numeric
  if (body.price !== undefined) body.price = Number(body.price);
  if (body.quantity !== undefined) body.quantity = Number(body.quantity);
  if (body.discount !== undefined) body.discount = Number(body.discount);

  // boolean
  if (body.requiredPrescription !== undefined)
    body.requiredPrescription = body.requiredPrescription === 'true';
  if (body.inStock !== undefined) body.inStock = body.inStock === 'true';
  if (body.isDeleted !== undefined) body.isDeleted = body.isDeleted === 'true';

  //  date
  if (body.expiryDate !== undefined)
    body.expiryDate = new Date(body.expiryDate);

  // array
  if (typeof body.categories === 'string')
    body.categories = body.categories
      .split(',')
      .map((s: string) => s.trim())
      .filter((s: string) => s);
  if (typeof body.symptoms === 'string')
    body.symptoms = body.symptoms
      .split(',')
      .map((s: string) => s.trim())
      .filter((s: string) => s);
  if (typeof body.tags === 'string')
    body.tags = body.tags
      .split(',')
      .map((s: string) => s.trim())
      .filter((s: string) => s);

  //  remove 'image' field if it exists in body
  delete body.image;

  next();
};
