"use server";
import { dbConnect } from "@/lib/dbConnect";

export const GetServiceAreas = async () => {
  const areas = await dbConnect("serviceAreas")
    .find({ status: "active" })
    .toArray();

  return areas.map((area) => ({
    _id: area._id.toString(),
    region: area.region,
    district: area.district,
    city: area.city,
    covered_area: Array.isArray(area.covered_area) ? area.covered_area : [],
    status: area.status,
    flowchart: area.flowchart,
    longitude: area.longitude,
    latitude: area.latitude,
  }));
};
