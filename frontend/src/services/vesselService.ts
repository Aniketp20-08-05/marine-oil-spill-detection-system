import { apiGet } from "./api";
import { Vessel } from "@/types/vessel";

export async function fetchVessels(): Promise<Vessel[]> {
  return apiGet<Vessel[]>("/vessels/");
}