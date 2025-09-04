import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user: { email: string; id: string };
    }
  }
}

export const authWithHeadersMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const user = jwt.verify(token, "secret") as { email: string; id: string };
  req.user = user;
  next();
};

export const authWithCookiesMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.signedCookies?.token;
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const user = jwt.verify(token, "secret") as { email: string; id: string };
  req.user = user;
  next();
};
