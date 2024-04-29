import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { PostRequest } from "itrm-tools";
import { ParsedQs } from "qs";
import createUser from "../../../domain/cases/users/create_user";
import "dotenv/config";
import findUser from "../../../domain/cases/users/find_user";

const secretKey = process.env.JWT_SECRET_KEY;

class SignupController extends PostRequest {
  constructor() {
    super({
      path: "/signup",
      params: [],
    });
  }
  apply(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const { first_name, last_name, email, password } = req.body;
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await createUser({
          first_name,
          last_name,
          email,
          password: hashedPassword,
        });

        console.log(
          "🚀 ~ SignupController ~ returnnewPromise ~ user:",
          typeof user
        );

        if (typeof user === "object") {
          console.log(user._id);
        }

        const findCurrentUser = await findUser({ _id: user._id });

        const payload = {
          userId: findCurrentUser?.id,
          firstName: findCurrentUser?.first_name,
          lastName: findCurrentUser?.last_name,
          email: findCurrentUser?.email,
        };

        const token = jwt.sign(payload, secretKey!, {
          expiresIn: "1h",
          algorithm: "HS256",
        });

        res.status(201).json({ token });
        resolve({ token });
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default SignupController;
