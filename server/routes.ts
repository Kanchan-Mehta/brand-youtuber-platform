import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCreatorSchema, insertBrandSchema } from "@shared/schema";
import multer from "multer";
import path from "path";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/creators", upload.single("verificationBadge"), async (req, res) => {
    try {
      const data = { ...req.body };
      if (req.file) {
        data.verificationBadge = req.file.buffer.toString("base64");
      }
      
      const creator = await storage.createCreator(insertCreatorSchema.parse(data));
      res.status(201).json(creator);
    } catch (error) {
      res.status(400).json({ error: "Invalid creator data" });
    }
  });

  app.post("/api/brands", async (req, res) => {
    try {
      const brand = await storage.createBrand(insertBrandSchema.parse(req.body));
      res.status(201).json(brand);
    } catch (error) {
      res.status(400).json({ error: "Invalid brand data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
