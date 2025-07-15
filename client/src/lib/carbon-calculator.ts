// Carbon emission factors (kg CO2 per km per person)
const EMISSION_FACTORS = {
  car: 0.2, // kg CO2/km
  train: 0.05, // kg CO2/km
  air: 0.15, // kg CO2/km
  bus: 0.08, // kg CO2/km
  bike: 0, // kg CO2/km
} as const;

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function calculateEmissions(transportMode: keyof typeof EMISSION_FACTORS, distance: number): number {
  const factor = EMISSION_FACTORS[transportMode];
  return distance * factor;
}

export function getTotalEmissions(segments: Array<{ transportMode: keyof typeof EMISSION_FACTORS; distance: number }>): number {
  return segments.reduce((total, segment) => {
    return total + calculateEmissions(segment.transportMode, segment.distance);
  }, 0);
}

export function getEmissionsByMode(segments: Array<{ transportMode: keyof typeof EMISSION_FACTORS; distance: number }>) {
  const emissionsByMode = {
    car: 0,
    train: 0,
    air: 0,
    bus: 0,
    bike: 0,
  };

  segments.forEach(segment => {
    emissionsByMode[segment.transportMode] += calculateEmissions(segment.transportMode, segment.distance);
  });

  return emissionsByMode;
}
