import { 
  travelItineraries, 
  travelSegments,
  type TravelItinerary, 
  type TravelSegment,
  type InsertTravelItinerary,
  type InsertTravelSegment 
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private itineraries: Map<number, TravelItinerary>;
  private segments: Map<number, TravelSegment>;
  private currentItineraryId: number;
  private currentSegmentId: number;

  constructor() {
    this.itineraries = new Map();
    this.segments = new Map();
    this.currentItineraryId = 1;
    this.currentSegmentId = 1;
  }

  async createItinerary(insertItinerary: InsertTravelItinerary): Promise<TravelItinerary> {
    const id = this.currentItineraryId++;
    const itinerary: TravelItinerary = {
      ...insertItinerary,
      id,
      createdAt: new Date(),
    };
    this.itineraries.set(id, itinerary);
    return itinerary;
  }

  async getItinerary(id: number): Promise<TravelItinerary | undefined> {
    return this.itineraries.get(id);
  }

  async getAllItineraries(): Promise<TravelItinerary[]> {
    return Array.from(this.itineraries.values());
  }

  async createSegment(insertSegment: InsertTravelSegment): Promise<TravelSegment> {
    const id = this.currentSegmentId++;
    const segment: TravelSegment = {
      ...insertSegment,
      id,
    };
    this.segments.set(id, segment);
    return segment;
  }

  async getSegmentsByItineraryId(itineraryId: number): Promise<TravelSegment[]> {
    return Array.from(this.segments.values())
      .filter(segment => segment.itineraryId === itineraryId)
      .sort((a, b) => a.segmentOrder - b.segmentOrder);
  }

  async updateItineraryEmissions(id: number, totalEmissions: number): Promise<void> {
    const itinerary = this.itineraries.get(id);
    if (itinerary) {
      itinerary.totalEmissions = totalEmissions;
      this.itineraries.set(id, itinerary);
    }
  }
}

export const storage = new MemStorage();
