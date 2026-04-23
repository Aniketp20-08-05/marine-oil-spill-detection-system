"use client";

import { useState } from "react";
import { triggerResponseAction, TeamNotification } from "@/services/responseActionService";

const RESPONSE_ACTIONS = [
  "Dispatch Coast Guard",
  "Mobilize Oil Boom Team",
  "Initiate Wildlife Response",
  "Dispatch Inventory",
];

export default function ActionsPanel() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedAlertId, setSelectedAlertId] = useState<number | null>(null);
  const [teamNotifications, setTeamNotifications] = useState<TeamNotification[]>([]);

  const handleActionClick = async (actionType: string) => {
    // For now, use alert_id = 1 (you can make this dynamic later)
    const alertId = selectedAlertId || 1;

    setLoading(true);
    setMessage("");
    setTeamNotifications([]);

    try {
      const response = await triggerResponseAction(alertId, actionType, "user");
      setMessage(`✓ ${actionType} triggered successfully`);
      setTeamNotifications(response.team_notifications);

      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage("");
        setTeamNotifications([]);
      }, 5000);
    } catch (error) {
      console.error("Error triggering action:", error);
      setMessage("✗ Failed to trigger action");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-slate-800 p-5 text-white shadow-md">
      <h2 className="mb-4 text-xl font-bold">Response Actions</h2>

      <div className="space-y-3">
        {RESPONSE_ACTIONS.map((action) => (
          <button
            key={action}
            onClick={() => handleActionClick(action)}
            disabled={loading}
            className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition-all hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : action}
          </button>
        ))}
      </div>

      {message && (
        <div
          className={`mt-4 rounded-lg p-3 text-sm font-medium ${
            message.includes("✓")
              ? "bg-green-900 text-green-200"
              : "bg-red-900 text-red-200"
          }`}
        >
          {message}
        </div>
      )}

      {teamNotifications.length > 0 && (
        <div className="mt-4 rounded-lg bg-blue-900 p-4">
          <h3 className="mb-3 font-bold text-blue-200">📱 Team SMS Alerts Sent:</h3>
          <div className="space-y-2">
            {teamNotifications.map((notification, index) => (
              <div
                key={index}
                className={`flex items-center justify-between rounded px-3 py-2 text-sm ${
                  notification.status === "sent"
                    ? "bg-blue-800 border-l-4 border-green-500"
                    : "bg-blue-800 border-l-4 border-yellow-500"
                }`}
              >
                <div className="flex-1">
                  <div className="font-semibold text-blue-100">
                    {notification.team_name}
                  </div>
                  <div className="text-xs text-blue-300">
                    {notification.recipient}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded px-2 py-1 text-xs font-medium ${
                    notification.status === "sent"
                      ? "bg-green-900 text-green-200"
                      : "bg-yellow-900 text-yellow-200"
                  }`}>
                    {notification.status?.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {teamNotifications.some(n => n.status === "failed") && (
            <div className="mt-3 rounded bg-yellow-900 p-2 text-xs text-yellow-200">
              ⚠️ Some SMS deliveries failed. Check backend logs for details.
            </div>
          )}
        </div>
      )}
    </div>
  );
}