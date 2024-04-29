import "dotenv/config";
import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { GetRequest } from "itrm-tools";
import { ParsedQs } from "qs";
import findUser from "../../../../domain/cases/users/find_user";
import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET_KEY;

interface CustomRequestInterface
  extends Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>> {
  payload?: any;
}

interface User {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  iat: number;
  exp: number;
}

class CheckStatusController extends GetRequest {
  constructor() {
    super({
      path: "/check-status",
      params: [],
    });
  }
  apply(
    req: CustomRequestInterface,
    res: Response<any, Record<string, any>>
  ): Promise<void | Response> {
    return new Promise(async (resolve, reject) => {
      try {
        const data = (await req.payload) as User;
        const { email } = data;
        if (!data) resolve(res.status(401).json({ status: "unauthorized" }));

        const user = await findUser({ email });
        console.log(
          "🚀 ~ CheckStatusController ~ returnnewPromise ~ user:",
          user
        );

        const payload = {
          userId: user?.id,
          firstName: user?.first_name,
          lastName: user?.last_name,
          email: user?.email,
        };
        const token = jwt.sign(payload, secretKey!, {
          expiresIn: "1h",
          algorithm: "HS256",
        });

        resolve(
          res.status(200).json({ status: "authorized", user: payload, token })
        );
      } catch (error) {
        console.log(
          "🚀 ~ CheckStatusController ~ returnnewPromise ~ error:",
          error
        );
        reject(error);
      }
    });
  }
}

export default CheckStatusController;
