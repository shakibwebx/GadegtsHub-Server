import { Response } from 'express';

export type TResponse<T> = {
  success?: boolean; // RESTful convention
  statusCode: number;
  message: string;
  token?: string;
  data: T | T[] | null;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success ?? true,
    statusCode: data.statusCode,
    message: data.message,
    token: data.token,
    data: data.data,
  });
};

export default sendResponse;
