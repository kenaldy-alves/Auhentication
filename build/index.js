"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv_1 = require("dotenv");
dotenv_1.config();
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const express_status_monitor_1 = __importDefault(require("express-status-monitor"));
require("reflect-metadata");
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cls_rtracer_1 = require("cls-rtracer");
morgan_1.default.token("reqId", (req) => req.get("X-Request-Id") || String(cls_rtracer_1.id()));
class App {
    configure() {
        return __awaiter(this, void 0, void 0, function* () {
            //await createConnection();
            require("./dependencias");
            const app = express_1.default();
            app.disable("x-powered-by");
            app.use(cors_1.default({ exposedHeaders: ["forbbiden-reason"] }));
            app.use(express_status_monitor_1.default());
            const swaggerDocument = yamljs_1.default.load("./api-spec.yaml");
            app.use("/auth/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
            app.use(body_parser_1.default.json({ limit: "5mb" }));
            app.use(cls_rtracer_1.expressMiddleware({ useHeader: true }));
            app.use(morgan_1.default(`:reqId :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"`));
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
            app.use((error, _req, res, next) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (error && error.statusCode) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    res.status(error.statusCode).json({ error: error.message });
                }
                else if (error) {
                    res.status(500).json({ error: error.message });
                }
                else {
                    next(error);
                }
            });
            app.listen(8000);
        });
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
//# sourceMappingURL=index.js.map