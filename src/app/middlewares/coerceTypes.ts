import { Request, Response, NextFunction } from 'express';

export const coerceProductTypes = (
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

  // array - handle both string (comma-separated) and array format
  if (body['categories[]']) {
    body.categories = Array.isArray(body['categories[]'])
      ? body['categories[]']
      : [body['categories[]']];
    delete body['categories[]'];
  } else if (typeof body.categories === 'string') {
    body.categories = body.categories
      .split(',')
      .map((s: string) => s.trim())
      .filter((s: string) => s);
  }

  if (body['symptoms[]']) {
    body.symptoms = Array.isArray(body['symptoms[]'])
      ? body['symptoms[]']
      : [body['symptoms[]']];
    delete body['symptoms[]'];
  } else if (typeof body.symptoms === 'string') {
    body.symptoms = body.symptoms
      .split(',')
      .map((s: string) => s.trim())
      .filter((s: string) => s);
  }

  if (body['tags[]']) {
    body.tags = Array.isArray(body['tags[]'])
      ? body['tags[]']
      : [body['tags[]']];
    delete body['tags[]'];
  } else if (typeof body.tags === 'string') {
    body.tags = body.tags
      .split(',')
      .map((s: string) => s.trim())
      .filter((s: string) => s);
  }

  //  remove 'image' field if it exists in body
  delete body.image;

  next();
};
