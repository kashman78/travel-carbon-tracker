import { 
  travelItineraries, 
  travelSegments,
  type TravelItinerary, 
  type TravelSegment,
  type InsertTravelItinerary,
  type InsertTravelSegment 
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Travel Itinerary operations
  createItinerary(itinerary: InsertTravelItinerary): Promise<TravelItinerary>;
  getItinerary(id: number): Promise<TravelItinerary | undefined>;
  getAllItineraries(): Promise<TravelItinerary[]>;
  
  // Travel Segment operations
  createSegment(segment: InsertTravelSegment): Promise<TravelSegment>;
  getSegmentsByItineraryId(itineraryId: number): Promise<TravelSegment[]>;
  updateItineraryEmissions(id: number, totalEmissions: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async createItinerary(insertItinerary: InsertTravelItinerary): Promise<TravelItinerary> {
    const [itinerary] = await db
      .insert(travelItineraries)
      .values(insertItinerary)
      .returning();
    return itinerary;
  }

  async getItinerary(id: number): Promise<TravelItinerary | undefined> {
    const [itinerary] = await db.select().from(travelItineraries).where(eq(travelItineraries.id, id));
    return itinerary || undefined;
  }

  async getAllItineraries(): Promise<TravelItinerary[]> {
    return await db.select().from(travelItineraries);
  }

  async createSegment(insertSegment: InsertTravelSegment): Promise<TravelSegment> {
    const [segment] = await db
      .insert(travelSegments)
      .values(insertSegment)
      .returning();
    return segment;
  }

  async getSegmentsByItineraryId(itineraryId: number): Promise<TravelSegment[]> {
    return await db
      .select()
      .from(travelSegments)
      .where(eq(travelSegments.itineraryId, itineraryId))
      .orderBy(travelSegments.segmentOrder);
  }

  async updateItineraryEmissions(id: number, totalEmissions: number): Promise<void> {
    await db
      .update(travelItineraries)
      .set({ totalEmissions })
      .where(eq(travelItineraries.id, id));
  }
}

export const storage = new DatabaseStorage();
