interface PlaceResult {
  address: string;
  coordinates: string;
}

// Google Maps API key should be provided as environment variable
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

export async function searchPlaces(query: string): Promise<PlaceResult[]> {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn("Google Maps API key not configured");
    // Return mock data for development
    return [
      {
        address: `${query} (Sample Location)`,
        coordinates: "28.6139,77.2090"
      }
    ];
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch places');
    }
    
    const data = await response.json();
    
    return data.results.map((result: any) => ({
      address: result.formatted_address,
      coordinates: `${result.geometry.location.lat},${result.geometry.location.lng}`
    }));
  } catch (error) {
    console.error('Error searching places:', error);
    return [];
  }
}

export async function initializeGoogleMaps(): Promise<void> {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn("Google Maps API key not configured");
    return;
  }

  // Load Google Maps JavaScript API
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
  script.async = true;
  document.head.appendChild(script);
  
  return new Promise((resolve) => {
    script.onload = () => resolve();
  });
}
