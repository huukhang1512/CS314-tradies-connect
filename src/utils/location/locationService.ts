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
