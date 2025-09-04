import { Request, Response } from "express";
import { WallService } from "./wall.service";
import { CreateWallRequest } from "../../types";

export class WallController {
  constructor(private readonly wallService: WallService) {}

  getAllWalls = async (req: Request, res: Response): Promise<void> => {
    try {
      const userEmail = req.user.email;

      const walls = await this.wallService.getAllWalls();
      res.json({ walls, email: userEmail });
    } catch (error) {
      console.error("Error getting walls:", error);
      res.status(500).json({ error: "Failed to retrieve walls" });
    }
  };

  getWallById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const wall = await this.wallService.getWallById(id);

      if (!wall) {
        res.status(404).json({ error: "Wall not found" });
        return;
      }

      res.json({ wall });
    } catch (error) {
      console.error("Error getting wall:", error);
      res.status(500).json({ error: "Failed to retrieve wall" });
    }
  };

  createWall = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const wallData: CreateWallRequest = req.body;

      if (!wallData.name) {
        res.status(400).json({ error: "Wall name is required" });
        return;
      }

      const wall = await this.wallService.createWall(wallData);
      res.status(201).json({ wall });
    } catch (error) {
      console.error("Error creating wall:", error);
      res.status(500).json({ error: "Failed to create wall" });
    }
  };

  deleteWall = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const exists = await this.wallService.wallExists(id);

      if (!exists) {
        res.status(404).json({ error: "Wall not found" });
        return;
      }

      await this.wallService.deleteWall(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting wall:", error);
      res.status(500).json({ error: "Failed to delete wall" });
    }
  };
}
