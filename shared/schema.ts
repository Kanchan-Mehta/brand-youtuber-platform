import { pgTable, text, serial, json, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const creators = pgTable("creators", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  niche: text("niche").notNull(),
  location: text("location").notNull(),
  email: text("email").notNull(),
  subscribers: integer("subscribers").notNull(),
  avgViews: integer("avg_views").notNull(),
  engagementRate: text("engagement_rate").notNull(),
  topVideos: json("top_videos").notNull(),
  demographics: json("demographics").notNull(),
  contentFormat: text("content_format").notNull(),
  brandAlignment: text("brand_alignment").notNull(),
  postingFrequency: text("posting_frequency").notNull(),
  verificationBadge: text("verification_badge").notNull(),
  pastCollaborations: text("past_collaborations"),
  portfolio: text("portfolio"),
  creatorUsp: text("creator_usp"),
});

export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  industry: text("industry").notNull(),
  campaignType: text("campaign_type").notNull(),
  targetAudience: text("target_audience").notNull(),
  deliverables: json("deliverables").notNull(),
});

export const insertCreatorSchema = createInsertSchema(creators);
export const insertBrandSchema = createInsertSchema(brands);

export type Creator = typeof creators.$inferSelect;
export type InsertCreator = z.infer<typeof insertCreatorSchema>;
export type Brand = typeof brands.$inferSelect;
export type InsertBrand = z.infer<typeof insertBrandSchema>;
