import { Router } from "express";
import { WallRepository } from "../modules/wall/wall.repository";
import { WallService } from "../modules/wall/wall.service";
import { WallController } from "../modules/wall/wall.controller";
import { authWithHeadersMiddleware } from "../middleware/auth.middleware";

const router = Router();
const wallRepository = new WallRepository();
const wallService = new WallService(wallRepository);
const wallController = new WallController(wallService);

router.use(authWithHeadersMiddleware);

router.get("/", wallController.getAllWalls);
router.get("/:id", wallController.getWallById);
router.post("/", wallController.createWall);
router.delete("/:id", wallController.deleteWall);

export { router as wallRoutes };
