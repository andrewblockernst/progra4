import { database } from "../../db/connection";
import { User } from "../../types";
import { v4 as uuidv4 } from "uuid";
import { CreateUserRequest } from "./auth.dto";

export class AuthRepository {
  async getAllUsers(): Promise<User[]> {
    return database.all<User>("SELECT * FROM users");
  }

  async getUserById(id: string): Promise<User | undefined> {
    return database.get<User>("SELECT * FROM users WHERE id = ?", [id]);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return database.get<User>("SELECT * FROM users WHERE email = ?", [email]);
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    const id = uuidv4();
    const now = new Date().toISOString();

    await database.run(
      "INSERT INTO users (id, email, password) VALUES (?, ?, ?)",
      [id, userData.email, userData.password]
    );

    const user = await this.getUserById(id);
    if (!user) {
      throw new Error("Failed to create user");
    }

    return user;
  }

  async deleteUser(id: string): Promise<boolean> {
    await database.run("DELETE FROM users WHERE id = ?", [id]);
    return true;
  }

  async userExists(id: string): Promise<boolean> {
    const user = await this.getUserById(id);
    return !!user;
  }
}
