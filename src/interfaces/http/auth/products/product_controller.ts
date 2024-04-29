import axios from "axios";
import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { GetRequest } from "itrm-tools";
import { ParsedQs } from "qs";

class ProductController extends GetRequest {
  constructor() {
    super({
      path: "/productos",
      params: [],
    });
  }
  apply(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.get("https://dummyjson.com/carts");

        resolve(
          res.status(200).json({
            result: response.data,
            message: "Authenticated user!",
            statusCode: res.statusCode,
          })
        );
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default ProductController;
