import { NextFunction, Request, Response } from "express";
import {
  ForbiddenException,
  InternalException,
  NotFoundException,
  UnathorizedExecption,
} from "../exceptions/exceptions";

const exceptionsMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof NotFoundException) {
    return res.status(error.statusCode).json({ message: error.message });
  } else if (error instanceof InternalException) {
    return res.status(error.statusCode).json({ message: error.message });
  } else if (error instanceof UnathorizedExecption) {
    return res.status(error.statusCode).json({ message: error.message });
  } else if (error instanceof ForbiddenException) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  console.error(error);
  return res.status(500).json({ message: "Erro interno do servidor." });
};

export default exceptionsMiddleware;
