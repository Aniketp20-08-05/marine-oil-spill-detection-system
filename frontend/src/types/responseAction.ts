export type ResponseAction = {
  action_id: number;
  alert_id: number;
  action_type: string;
  status: string;
  description?: string;
  triggered_by: string;
  timestamp: string;
};

export type ActionTriggerResponse = {
  action: ResponseAction;
  team_notifications: any[];
};
