import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCreatorSchema, insertBrandSchema } from "@shared/schema";
import multer from "multer";
import path from "path";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB limit
    fieldSize: 10 * 1024 * 1024 // 10MB field size limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/creators", upload.single("verificationBadge"), async (req, res) => {
    try {
      const formData = { ...req.body };

      // Parse JSON strings back to objects
      if (typeof formData.demographics === "string") {
        formData.demographics = JSON.parse(formData.demographics);
      }
      if (typeof formData.topVideos === "string") {
        formData.topVideos = JSON.parse(formData.topVideos);
      }

      // Handle file upload
      if (req.file) {
        const base64Image = req.file.buffer.toString('base64');
        formData.verificationBadge = `data:${req.file.mimetype};base64,${base64Image}`;
      }

      // Convert string numbers to actual numbers
      formData.subscribers = parseInt(formData.subscribers);
      formData.avgViews = parseInt(formData.avgViews);

      const validatedData = insertCreatorSchema.parse(formData);
      const creator = await storage.createCreator(validatedData);
      res.status(201).json(creator);
    } catch (error) {
      console.error("Creator creation error:", error);
      res.status(400).json({ error: "Invalid creator data", details: error });
    }
  });

  app.post("/api/brands", async (req, res) => {
    try {
      const formData = { ...req.body };

      // Parse JSON strings back to objects
      if (typeof formData.deliverables === "string") {
        try {
          formData.deliverables = JSON.parse(formData.deliverables);
        } catch {
          // If parsing fails, create a structured object with the string as additionalRequirements
          formData.deliverables = {
            videoRequirements: { count: 0, duration: '', style: '' },
            socialMedia: { platforms: [], requirements: '' },
            additionalRequirements: formData.deliverables
          };
        }
      }

      // Ensure the deliverables object has the correct structure
      if (!formData.deliverables.videoRequirements) {
        formData.deliverables.videoRequirements = { count: 0, duration: '', style: '' };
      }
      if (!formData.deliverables.socialMedia) {
        formData.deliverables.socialMedia = { platforms: [], requirements: '' };
      }
      if (!formData.deliverables.additionalRequirements) {
        formData.deliverables.additionalRequirements = '';
      }

      const validatedData = insertBrandSchema.parse(formData);
      const brand = await storage.createBrand(validatedData);
      res.status(201).json(brand);
    } catch (error) {
      console.error("Brand creation error:", error);
      res.status(400).json({ error: "Invalid brand data", details: error });
    }
  });

  // Get creator profile
  app.get("/api/creators/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const creator = await storage.getCreator(id);
    if (!creator) {
      res.status(404).json({ error: "Creator not found" });
      return;
    }
    res.json(creator);
  });

  // Get brand profile
  app.get("/api/brands/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const brand = await storage.getBrand(id);
    if (!brand) {
      res.status(404).json({ error: "Brand not found" });
      return;
    }
    res.json(brand);
  });

  const httpServer = createServer(app);
  return httpServer;
}