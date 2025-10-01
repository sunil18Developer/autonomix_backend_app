import { Router } from "express";
import taskRoutes from "./tasks";

const router = Router();

router.use("/tasks", taskRoutes);

export default router;
