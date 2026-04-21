import { apiGet } from "./api";
import { PipelineResponse } from "@/types/pipeline";

export async function runPipeline(): Promise<PipelineResponse> {
  return apiGet<PipelineResponse>("/pipeline/run");
}