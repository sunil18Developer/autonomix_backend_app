import { Router } from "express";
import { generateTasks, getTasks } from "../../controllers/tasks-controller";
const router = Router();

router.post("/generate", generateTasks);
router.get("/", getTasks);

export default router;
