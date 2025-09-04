import { Wall, CreateWallRequest } from "../../types";
import { WallRepository } from "./wall.repository";

export class WallService {
  constructor(private readonly wallRepository: WallRepository) {}

  async getAllWalls(): Promise<Wall[]> {
    // Here we can implement some business logic
    return this.wallRepository.getAllWalls();
  }

  async getWallById(id: string): Promise<Wall | undefined> {
    return this.wallRepository.getWallById(id);
  }

  async createWall(wallData: CreateWallRequest): Promise<Wall> {
    // Here we can implement some business logic like validation, etc.
    return this.wallRepository.createWall(wallData);
  }

  async deleteWall(id: string): Promise<boolean> {
    return this.wallRepository.deleteWall(id);
  }

  async wallExists(id: string): Promise<boolean> {
    return this.wallRepository.wallExists(id);
  }
}
