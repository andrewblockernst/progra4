import { User } from "../../types";
import { CreateUserRequest } from "./auth.dto";
import { AuthRepository } from "./auth.repository";
import { hash, verify } from "argon2";
import jwt from "jsonwebtoken";

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async getAllUsers(): Promise<User[]> {
    return this.authRepository.getAllUsers();
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    const existingUser = await this.authRepository.getUserByEmail(
      userData.email
    );
    if (existingUser) {
      throw new Error("User already exists");
    }

    const password = userData.password;
    const hashedPassword = await hash(password);

    return this.authRepository.createUser({
      ...userData,
      password: hashedPassword,
    });
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.authRepository.getUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await verify(user.password, password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign({ id: user.id, email: user.email }, "secret");

    return token;
  }
}
