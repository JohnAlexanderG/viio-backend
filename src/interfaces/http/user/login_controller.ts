import bcrypt from "bcrypt";
import "dotenv/config";
import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { PostRequest } from "itrm-tools";
import jwt from "jsonwebtoken";
import { ParsedQs } from "qs";
import findUser from "../../../domain/cases/users/find_user";

const secretKey = process.env.JWT_SECRET_KEY;

class LoginController extends PostRequest {
  constructor() {
    super({
      path: "/login",
      params: [],
    });
  }

  apply(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const { email, password: inputPassword } = req.body;
      try {
        const user = await findUser({ email });
        console.log("🚀 ~ LoginController ~ returnnewPromise ~ user:", user);

        if (!user) {
          reject({ message: "Invalid credentials" });
        }

        const isValidPassword = await bcrypt.compare(
          inputPassword,
          user?.password!
        );

        const message = isValidPassword
          ? user
          : { message: "Invalid credentials" };

        if (!isValidPassword || user === null) {
          reject(message);
        } else {
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

          resolve(res.status(200).json({ token }));
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default LoginController;
