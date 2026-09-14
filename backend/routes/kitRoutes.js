import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createKit,getKit,getKits,updateKit,regenerateQuestions,deleteKit } from "../controllers/kitController.js";
import { updatePractice } from "../controllers/practiceController.js";
const router = express.Router();

router.post("/", authMiddleware,  createKit);
router.get("/:id", authMiddleware, getKit);
router.get("/", authMiddleware, getKits);
router.put("/:id", authMiddleware, updateKit);
router.post("/:id/regenerate",authMiddleware,regenerateQuestions);
router.put("/:id/practice", authMiddleware, updatePractice);
router.delete("/:id",authMiddleware,deleteKit);

export default router;