# Travel Carbon Footprint Tracker

## Overview

This is a full-stack web application for calculating and tracking carbon emissions from travel itineraries. Users can create multi-segment travel plans with different transportation modes and get real-time carbon footprint calculations. The application uses modern web technologies with a React frontend, Express backend, and PostgreSQL database.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack React Query for server state
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite with TypeScript support

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Middleware**: Express middleware for request logging and error handling
- **Development**: Hot reload with Vite integration

### Data Storage
- **Database**: PostgreSQL with Neon serverless connection
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Relational design with travel itineraries and segments tables
- **Migrations**: Drizzle Kit for schema management
- **Fallback**: In-memory storage for development/testing

## Key Components

### Database Schema
The application uses two main tables:
- `travel_itineraries`: Stores basic trip information (traveler, date, base location, total emissions)
- `travel_segments`: Stores individual journey segments with transport mode, locations, coordinates, distance, and emissions

### Carbon Calculation Engine
- Haversine formula for distance calculation between coordinates
- Emission factors for different transport modes (car, train, air, bus, bike)
- Real-time calculation of carbon footprint per segment and total trip

### Location Services
- Google Maps API integration for location search and geocoding
- Fallback mock data when API key is not configured
- Coordinate-based distance calculations

### Form System
- Multi-step form with progress tracking
- Dynamic segment addition/removal (max 5 segments)
- Real-time validation with Zod schemas
- Location search with coordinate capture

## Data Flow

1. **User Input**: Multi-step form collects traveler info and travel segments
2. **Location Resolution**: Google Maps API resolves addresses to coordinates
3. **Distance Calculation**: Haversine formula calculates distances between coordinates
4. **Emission Calculation**: Apply transport-specific emission factors to distances
5. **Data Persistence**: Store itinerary and segments in PostgreSQL
6. **Response**: Return calculated emissions and stored data to frontend

## External Dependencies

### Required Services
- **Neon PostgreSQL**: Serverless PostgreSQL database
- **Google Maps API**: Location search and geocoding (optional, has fallback)

### Key Libraries
- **Frontend**: React, TanStack Query, React Hook Form, Zod, Wouter, Shadcn/ui
- **Backend**: Express, Drizzle ORM, Neon serverless client
- **Development**: Vite, TypeScript, Tailwind CSS, ESBuild

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized React bundle to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Assets**: Static files served from build output

### Environment Configuration
- `NODE_ENV`: Controls development vs production behavior
- `DATABASE_URL`: PostgreSQL connection string (required)
- `VITE_GOOGLE_MAPS_API_KEY`: Google Maps API key (optional)

### Development vs Production
- **Development**: Vite dev server with HMR, in-memory storage fallback
- **Production**: Bundled static files, PostgreSQL database required
- **Replit Integration**: Special handling for Replit environment detection

The application is designed to work in both development and production environments, with graceful fallbacks for missing external services during development.