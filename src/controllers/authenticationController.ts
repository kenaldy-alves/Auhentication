import { Response, Request } from "express";
import {
  InvalidLoginData,
  AccessTokenException,
  InvalidParameterException,
  ChangePasswordException,
} from "../errors/authErrors";
import { Inject, Service } from "typedi";
import { AuthenticationService } from "../services/authenticationService";

@Service("authenticationController")
export class AuthenticationController {
  private authenticationService: AuthenticationService;

  constructor(@Inject("authenticationService") authenticationService: AuthenticationService) {
    this.authenticationService = authenticationService;
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const credentials = await this.authenticationService.login(email, password);
      res.status(200).json(credentials);
    } catch (error) {
      if (error instanceof InvalidLoginData) {
        res.status(422).json({ message: error.message });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const { accessToken } = req.body;
      await this.authenticationService.logout(accessToken);

      res.sendStatus(204);
    } catch (error) {
      if (error instanceof AccessTokenException) {
        res.status(422).json({ message: error.message });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const credentials = await this.authenticationService.refreshToken(refreshToken);

      res.status(200).json(credentials);
    } catch (error) {
      if (error instanceof InvalidParameterException) {
        res.status(422).json({ message: error.message });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  }

  async firstPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, confirmationCode } = req.body;
      const credentials = await this.authenticationService.firstPassword(email, password, confirmationCode);

      res.status(200).json(credentials);
    } catch (error) {
      if (error instanceof InvalidLoginData || error instanceof ChangePasswordException) {
        res.status(422).json({ message: error.message });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  }
}
