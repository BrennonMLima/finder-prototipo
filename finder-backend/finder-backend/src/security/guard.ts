import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

export interface TokenPayload {
  name: string;
  email: string;
  createdAt: Date;
  id: string;
  profileImageId: number,
  iat?: number;
  exp: number;
}

const protectedRoute = (req: Request, res: Response, next: NextFunction) => {
  let token = req.headers.authorization;
  if (!token) return res.status(401).send({ message: "Token não fornecido." });

  token = token.split("Bearer ")[1];

  try {
    jwt.verify(token, "SECRET") as TokenPayload;
    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({ message: "Token inválido." });
  }
};

export default protectedRoute;