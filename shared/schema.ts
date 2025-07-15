import { pgTable, text, serial, integer, real, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const travelItineraries = pgTable("travel_itineraries", {
  id: serial("id").primaryKey(),
  travelerName: text("traveler_name").notNull(),
  baseLocation: text("base_location").notNull(),
  travelDate: text("travel_date").notNull(),
  multipleTransport: boolean("multiple_transport").notNull().default(false),
  totalEmissions: real("total_emissions").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const travelSegments = pgTable("travel_segments", {
  id: serial("id").primaryKey(),
  itineraryId: integer("itinerary_id").references(() => travelItineraries.id).notNull(),
  segmentOrder: integer("segment_order").notNull(),
  transportMode: text("transport_mode").notNull(),
  fromLocation: text("from_location").notNull(),
  fromCoordinates: text("from_coordinates").notNull(),
  toLocation: text("to_location").notNull(),
  toCoordinates: text("to_coordinates").notNull(),
  distance: real("distance").notNull().default(0),
  emissions: real("emissions").notNull().default(0),
});

export const insertTravelItinerarySchema = createInsertSchema(travelItineraries).omit({
  id: true,
  createdAt: true,
});

export const insertTravelSegmentSchema = createInsertSchema(travelSegments).omit({
  id: true,
});

export const createItinerarySchema = z.object({
  travelerName: z.string().min(1, "Traveler name is required"),
  baseLocation: z.string().min(1, "Base location is required"),
  travelDate: z.string().min(1, "Travel date is required"),
  multipleTransport: z.boolean(),
  segments: z.array(z.object({
    transportMode: z.enum(["car", "train", "air", "bus", "bike"]),
    fromLocation: z.string().min(1, "From location is required"),
    fromCoordinates: z.string().min(1, "From coordinates are required"),
    toLocation: z.string().min(1, "To location is required"),
    toCoordinates: z.string().min(1, "To coordinates are required"),
  })).min(1, "At least one travel segment is required").max(5, "Maximum 5 travel segments allowed"),
});

export type InsertTravelItinerary = z.infer<typeof insertTravelItinerarySchema>;
export type InsertTravelSegment = z.infer<typeof insertTravelSegmentSchema>;
export type CreateItineraryRequest = z.infer<typeof createItinerarySchema>;
export type TravelItinerary = typeof travelItineraries.$inferSelect;
export type TravelSegment = typeof travelSegments.$inferSelect;
