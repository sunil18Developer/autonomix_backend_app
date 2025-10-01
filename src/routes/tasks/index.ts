import { Router } from "express";
import { generateTasks } from "../../controllers/tasks-controller";
const router = Router();

router.post("/generate", generateTasks);

export default router;
