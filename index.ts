/* eslint-disable @typescript-eslint/no-var-requires */
import { config } from "dotenv";
config();
import { createConnection } from "typeorm";
import bodyParser from "body-parser";
import express, { NextFunction, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import monitor from "express-status-monitor";
import "reflect-metadata";
import cors from "cors";
import morgan from "morgan";
import { expressMiddleware, id } from "cls-rtracer";

morgan.token("reqId", (req: Request) => req.get("X-Request-Id") || String(id()));

class App {
  public async configure(): Promise<void> {
    //await createConnection();
    require("./dependencias");

    const app = express();
    app.disable("x-powered-by");
    app.use(cors({ exposedHeaders: ["forbbiden-reason"] }));
    app.use(monitor());

    const swaggerDocument = YAML.load("./api-spec.yaml");
    app.use("/auth/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.use(bodyParser.json({ limit: "5mb" }));

    app.use(expressMiddleware({ useHeader: true }));
    app.use(
      morgan(
        `:reqId :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"`
      )
    );

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const swaggerRoutes = require("swagger-routes");
    swaggerRoutes(app, {
      api: "./api-spec.yaml",
      handlers: {
        path: "./build/src/endpoints",
        template: "templates/controller.mustache",
        generate: false,
        group: false,
      },
    });

    app.use((error: Error, _req: Request, res: Response, next: NextFunction): void => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (error && (error as any).statusCode) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        res.status((error as any).statusCode).json({ error: error.message });
      } else if (error) {
        res.status(500).json({ error: error.message });
      } else {
        next(error);
      }
    });

    app.listen(8000);
  }
}

const initializer = new App();
initializer
  .configure()
  .then(() => {
    console.log("Running ...");
  })
  .catch((error) => {
    console.log("Unexpected error", error);
    process.exit(1);
  });
