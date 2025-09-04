import { CreateUserRequest } from "./auth.dto";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  getAllUsers = async (_: Request, res: Response) => {
    const users = await this.authService.getAllUsers();
    res.json({ users });
  };

  createUser = async (req: Request, res: Response) => {
    try {
      const userData: CreateUserRequest = req.body;

      if (!userData.email) {
        return res.status(400).json({ error: "Email is required" });
      }

      if (!userData.password) {
        return res.status(400).json({ error: "Password is required" });
      }

      const user = await this.authService.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create user" });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      console.log(email, password);
      const token = await this.authService.login(email, password);
      res.cookie("token", token, {
        secure: true,
        signed: true,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      });
      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to login" });
    }
  };

  logout = async (req: Request, res: Response) => {
    res.clearCookie("userId");
    res.json({ message: "Logged out" });
  };
}
