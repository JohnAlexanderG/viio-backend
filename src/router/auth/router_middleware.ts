import "dotenv/config";
import { NextFunction, Request, RouterOptions } from "express";
import { ParamsDictionary, Response } from "express-serve-static-core";
import { APIRouter } from "itrm-tools";
import { verify } from "jsonwebtoken";
import { ParsedQs } from "qs";
import { Unauthorized } from "http-errors";

interface CustomRequestInterface
  extends Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>> {
  payload?: any;
}

const secretKey: string = process.env.JWT_SECRET_KEY!;

class RouterMiddlewareAuth extends APIRouter {
  constructor(path: string, options?: RouterOptions) {
    super(path, options);
  }

  protected async runMiddleware(
    req: CustomRequestInterface,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    if (!req?.headers?.authorization) {
      return res.status(401).json({ status: "unauthorized" });
    }
    const token = req?.headers?.authorization;
    verify(token!, secretKey, (err, payload) => {
      if (err) {
        return res.status(401).json({ ...err, status: "unauthorized" });
      }

      req.payload = payload;
      next();
    });
  }
}

export default RouterMiddlewareAuth;
