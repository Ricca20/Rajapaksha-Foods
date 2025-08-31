import express from "express";
import { createMessage } from "../application/application.contact.js";

const router = express.Router();

router.post("/", createMessage);

export default router;
