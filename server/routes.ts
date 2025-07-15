import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createItinerarySchema } from "@shared/schema";
import { calculateDistance, calculateEmissions } from "../client/src/lib/carbon-calculator";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Create a new travel itinerary
  app.post("/api/itineraries", async (req, res) => {
    try {
      const validatedData = createItinerarySchema.parse(req.body);
      
      // Create the itinerary
      const itinerary = await storage.createItinerary({
        travelerName: validatedData.travelerName,
        baseLocation: validatedData.baseLocation,
        travelDate: validatedData.travelDate,
        multipleTransport: validatedData.multipleTransport,
        totalEmissions: 0,
      });

      // Create segments and calculate emissions
      let totalEmissions = 0;
      
      for (let i = 0; i < validatedData.segments.length; i++) {
        const segmentData = validatedData.segments[i];
        
        // Calculate distance between coordinates
        const fromCoords = segmentData.fromCoordinates.split(',').map(Number);
        const toCoords = segmentData.toCoordinates.split(',').map(Number);
        const distance = calculateDistance(fromCoords[0], fromCoords[1], toCoords[0], toCoords[1]);
        
        // Calculate emissions for this segment
        const emissions = calculateEmissions(segmentData.transportMode, distance);
        totalEmissions += emissions;
        
        await storage.createSegment({
          itineraryId: itinerary.id,
          segmentOrder: i + 1,
          transportMode: segmentData.transportMode,
          fromLocation: segmentData.fromLocation,
          fromCoordinates: segmentData.fromCoordinates,
          toLocation: segmentData.toLocation,
          toCoordinates: segmentData.toCoordinates,
          distance,
          emissions,
        });
      }
      
      // Update total emissions
      await storage.updateItineraryEmissions(itinerary.id, totalEmissions);
      
      res.json({ 
        ...itinerary, 
        totalEmissions,
        message: "Itinerary created successfully" 
      });
    } catch (error: any) {
      res.status(400).json({ 
        message: error.message || "Failed to create itinerary" 
      });
    }
  });

  // Get all itineraries
  app.get("/api/itineraries", async (req, res) => {
    try {
      const itineraries = await storage.getAllItineraries();
      res.json(itineraries);
    } catch (error: any) {
      res.status(500).json({ 
        message: error.message || "Failed to fetch itineraries" 
      });
    }
  });

  // Get specific itinerary with segments
  app.get("/api/itineraries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const itinerary = await storage.getItinerary(id);
      
      if (!itinerary) {
        return res.status(404).json({ message: "Itinerary not found" });
      }
      
      const segments = await storage.getSegmentsByItineraryId(id);
      
      res.json({ ...itinerary, segments });
    } catch (error: any) {
      res.status(500).json({ 
        message: error.message || "Failed to fetch itinerary" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
