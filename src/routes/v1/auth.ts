import { Router } from "express";

// Import necessary Controllers
import registerController from "@/controllers/v1/register";

const router = Router();

router.post("/register", registerController);


export default router;