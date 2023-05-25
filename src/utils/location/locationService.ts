import * as z from "zod";

const locationSchema = z.object({
  place_id: z.number(),
  licence: z.string(),
  osm_type: z.string(),
  osm_id: z.number(),
  lat: z.string(),
  lon: z.string(),
  display_name: z.string(),
});

export type Location = z.infer<typeof locationSchema>;

export const reverseGeocode = async (lat: number, lng: number) => {
  const data = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&extratags=1`
  );
  const locationData = locationSchema.parse(await data.json());
  return locationData;
};
export type LatLng = {
  lat: number;
  lng: number;
};
export const distanceUsingLatLong = (loc1: LatLng, loc2: LatLng) => {
  const R = 6371e3; // metres
  const φ1 = (loc1.lat * Math.PI) / 180; // φ, λ in radians
  const φ2 = (loc2.lat * Math.PI) / 180;
  const Δφ = ((loc2.lat - loc1.lat) * Math.PI) / 180;
  const Δλ = ((loc2.lng - loc1.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // in metres
  return d;
} 
export const isDistanceWithinRadius = (loc1: LatLng, loc2: LatLng, radius: number) => {
  return distanceUsingLatLong(loc1, loc2) <= radius;
}
