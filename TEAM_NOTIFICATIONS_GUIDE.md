# Response Action Team Notifications System

## Overview
Implemented a complete team notification system that sends alerts to respective teams when response actions are triggered:
- Coast Guard
- Oil Boom Team  
- Wildlife Response Team
- Inventory Team

## Backend Implementation

### New Models
- **Team**: Stores team information (name, phone, email, contact person, location)
- **TeamNotification**: Tracks notifications sent to teams (action_id, team_id, message, status, delivery method)

### New Services
- **TeamNotificationService**: Manages team notifications
  - Maps action types to recipient teams
  - Generates team-specific alert messages
  - Sends notifications via SMS/Email/Push
  - Tracks delivery status

### Action to Team Mapping
| Action Type | Teams Notified |
|---|---|
| Dispatch Coast Guard | Coast Guard |
| Mobilize Oil Boom Team | Oil Boom Team |
| Initiate Wildlife Response | Wildlife Response Team |
| Dispatch Inventory | Inventory Team |

### API Endpoints

#### Teams Management
- `GET /teams/` - List all active teams
- `GET /teams/{team_id}` - Get specific team
- `POST /teams/` - Create new team

#### Actions (Updated)
- `POST /actions/` - Trigger action + notify teams
  - Returns: `{ action, team_notifications: [] }`
- `GET /actions/` - List all actions
- `GET /actions/alert/{alert_id}` - Get actions for alert
- `PATCH /actions/{action_id}` - Update action status

### Response Format
```json
{
  "action": {
    "action_id": 1,
    "alert_id": 1,
    "action_type": "Dispatch Coast Guard",
    "status": "executing",
    "triggered_by": "user",
    "timestamp": "2026-04-22T13:10:00"
  },
  "team_notifications": [
    {
      "team_id": 1,
      "team_name": "Coast Guard",
      "status": "sent",
      "method": "sms",
      "recipient": "+1-202-372-2000"
    }
  ]
}
```

## Frontend Implementation

### Updated Services
- **responseActionService.ts**: 
  - Added `ActionTriggerResponse` type
  - Added `TeamNotification` type
  - Updated `triggerResponseAction()` to return notifications

### Updated Components
- **ActionsPanel.tsx**:
  - Shows which teams received alerts
  - Displays delivery method (SMS/Email/Push)
  - Shows recipient contact info
  - Visual feedback with team notification list

### UI Features
1. Action buttons remain unchanged
2. Success/error feedback messages
3. **NEW**: Team notifications display showing:
   - Team name
   - Delivery method badge (SMS/EMAIL/PUSH)
   - Recipient contact info
4. Auto-clears notifications after 5 seconds

## How It Works

### User Flow
1. User clicks response action button (e.g., "Dispatch Coast Guard")
2. Frontend sends request with alert_id and action_type
3. Backend creates ResponseAction record
4. Backend identifies relevant teams based on action_type
5. Backend sends alerts to all relevant teams:
   - Generates team-specific notification message
   - Records notification in TeamNotification table
   - Sends via SMS/Email/Push (logs to console in dev)
6. Frontend receives response with:
   - Action details
   - List of teams notified
   - Delivery method and recipient info
7. Frontend displays team notification list
8. User sees confirmation of which teams were alerted

## Teams Initialized
Run `python -m scripts.seed_teams` to initialize:
- **Coast Guard**: +1-202-372-2000
- **Oil Boom Team**: +1-504-555-0101
- **Wildlife Response Team**: +1-706-555-0202
- **Inventory Team**: +1-713-555-0303

## Database Tables
- `teams` - Team information and contacts
- `team_notifications` - Record of all notifications sent
- `response_actions` - Response action records
- `alerts` - Alert records (existing)

## Future Enhancements
1. **Real Integrations**:
   - SMS: Integrate with Twilio or AWS SNS
   - Email: Integrate with SendGrid or AWS SES
   - Push: Firebase Cloud Messaging

2. **Advanced Features**:
   - Team availability scheduling
   - Escalation routing if team unavailable
   - Notification delivery confirmation/ACK
   - Retry mechanism for failed deliveries
   - Custom alert templates per team

3. **Monitoring**:
   - Notification delivery dashboard
   - Team response tracking
   - Failed delivery alerts
   - Delivery statistics

## Testing
To test the system:
1. Start backend: `uvicorn app.main:app --reload`
2. Open frontend at `http://localhost:3000`
3. Click any response action button
4. See team notifications displayed in the UI
5. Check backend logs to see notification logs
6. Query database to verify records created
