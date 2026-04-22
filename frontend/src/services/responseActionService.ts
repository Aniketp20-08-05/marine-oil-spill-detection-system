import { apiGet, apiPost, apiPatch } from "./api";

export interface ResponseAction {
  action_id: number;
  alert_id: number;
  action_type: string;
  status: string;
  description?: string;
  triggered_by: string;
  timestamp: string;
}

export interface TeamNotification {
  team_id: number;
  team_name: string;
  status: string;
  method: string;
  recipient: string;
}

export interface ActionTriggerResponse {
  action: ResponseAction;
  team_notifications: TeamNotification[];
}

export async function triggerResponseAction(
  alert_id: number,
  action_type: string,
  triggered_by: string = "system"
): Promise<ActionTriggerResponse> {
  return apiPost<ActionTriggerResponse>("/actions/", {
    alert_id,
    action_type,
    triggered_by,
  });
}

export async function getActionsForAlert(alert_id: number): Promise<ResponseAction[]> {
  return apiGet<ResponseAction[]>(`/actions/alert/${alert_id}`);
}

export async function getAllActions(): Promise<ResponseAction[]> {
  return apiGet<ResponseAction[]>("/actions/");
}

export async function updateActionStatus(
  action_id: number,
  status: string
): Promise<ResponseAction> {
  return apiPatch<ResponseAction>(`/actions/${action_id}`, { status });
}

