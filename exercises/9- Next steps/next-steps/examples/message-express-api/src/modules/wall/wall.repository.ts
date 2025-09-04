import { database } from "../../db/connection";
import { Wall, CreateWallRequest } from "../../types";
import { v4 as uuidv4 } from "uuid";

export class WallRepository {
  async getAllWalls(): Promise<Wall[]> {
    return database.all<Wall>("SELECT * FROM walls ORDER BY created_at DESC");
  }

  async getWallById(id: string): Promise<Wall | undefined> {
    return database.get<Wall>("SELECT * FROM walls WHERE id = ?", [id]);
  }

  async createWall(wallData: CreateWallRequest): Promise<Wall> {
    const id = uuidv4();
    const now = new Date().toISOString();

    await database.run(
      "INSERT INTO walls (id, name, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
      [id, wallData.name, wallData.description || null, now, now]
    );

    const wall = await this.getWallById(id);
    if (!wall) {
      throw new Error("Failed to create wall");
    }

    return wall;
  }

  async deleteWall(id: string): Promise<boolean> {
    await database.run("DELETE FROM walls WHERE id = ?", [id]);
    return true;
  }

  async wallExists(id: string): Promise<boolean> {
    const wall = await this.getWallById(id);
    return !!wall;
  }
}
