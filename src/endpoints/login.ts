import { Container } from "typedi";
import { AuthenticationController } from "../controllers/authenticationController";

const controller = Container.get<AuthenticationController>("authenticationController");
exports.handler = controller.login.bind(controller);
