import express from "express";
import {
  APIService,
  APIServiceConfig,
  APIServiceResponse,
  ExpressStandardConfiguration,
  SimpleAPIRouter,
} from "itrm-tools";
import db from "./infrastructure/mongodb/mongodb_connection";
import ProductController from "./interfaces/http/auth/products/product_controller";
import LoginController from "./interfaces/http/user/login_controller";
import SignupController from "./interfaces/http/user/signup_controller";
import RouterMiddlewareAuth from "./router/auth/router_middleware";
import CheckStatusController from "./interfaces/http/auth/check-status/check-status";

const app = express();

app.use(express.json());

const config: APIServiceConfig = {
  name: "Mi Servidor",
  port: 3000,
  express: new ExpressStandardConfiguration(),
};

const service = new APIService(config);

(async () => {
  try {
    service.init();
    await db
      .connect()
      .then(() => {
        console.log("🚀 ~ Successfully connected to the database!");
      })
      .catch((error) => {
        console.log("🚀 ~ error connecting to the database:", error);
      });

    /**
     * /api/viio/signup
     * /api/viio/login
     * */
    const SignupRequest = new SignupController();
    const loginRequest = new LoginController();
    // Router
    const router = new SimpleAPIRouter("/api/viio");
    // Router.init
    router.init();
    // Router.addRequest()
    router.addRequest(SignupRequest);
    router.addRequest(loginRequest);
    // service.addRouter()
    service.addRouter(router);

    /**
     * /api/viio/auth/productos
     * */
    const checkStatusRequest = new CheckStatusController();
    const productRequest = new ProductController();
    // Router
    const routerMiddlewareAuth = new RouterMiddlewareAuth("/api/viio/auth");
    // Router.init
    routerMiddlewareAuth.init();
    // Router.addRequest
    routerMiddlewareAuth.addRequest(checkStatusRequest)
    routerMiddlewareAuth.addRequest(productRequest);
    // service.addRouter()
    service.addRouter(routerMiddlewareAuth);

    service
      .run(() => {})
      .then((response: APIServiceResponse) => {
        console.log(
          "🚀 ~ ServiceResponse:",
          JSON.stringify([response], null, 2)
        );
      })
      .catch((error) => {
        console.log("🚀 ~ .then ~ error:", error);
      });
  } catch (error) {
    console.log("🚀 ~ error:", error);
  }
})();
