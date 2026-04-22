# SMS Alerts Configuration Guide

## Quick Setup for SMS Notifications

To receive SMS alerts on your phone when response actions are triggered, follow these steps:

### Step 1: Get Free Twilio Account

1. Go to **https://www.twilio.com/try-twilio**
2. Sign up for a free Twilio account (includes $20 trial credit)
3. Verify your email and phone number
4. Log in to your Twilio Console

### Step 2: Get Your Twilio Credentials

1. In Twilio Console, go to **Account** > **API keys & tokens**
2. Copy your **Account SID** and **Auth Token** (keep these secret!)
3. Go to **Phone Numbers** > **Manage** > **Active Numbers**
4. You'll see your Twilio phone number (e.g., +1 234 567 8900)
   - If you don't have one, click **Get a number** to assign one

### Step 3: Configure Your Backend

Create a `.env` file in the `backend` directory:

```bash
# backend/.env

# Twilio SMS Configuration
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
ENABLE_SMS=True
```

**Example:**
```
TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+12025551234
ENABLE_SMS=True
```

### Step 4: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

This installs Twilio SDK: `twilio==9.0.4`

### Step 5: Update Team Phone Numbers

Your teams already have default phone numbers. You can update them:

**Option A: Via API**
```bash
curl -X POST "http://localhost:8000/teams/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Coast Guard",
    "phone": "+1234567890",
    "email": "coastguard@example.com",
    "contact_person": "Commander",
    "location": "Coastal Region"
  }'
```

**Option B: Direct Database**
Edit the database and update team phone numbers in the `teams` table.

### Step 6: Test SMS Sending

1. Start your backend:
```bash
cd backend
uvicorn app.main:app --reload
```

2. In another terminal, trigger a test action:
```bash
curl -X POST "http://localhost:8000/actions/" \
  -H "Content-Type: application/json" \
  -d '{
    "alert_id": 1,
    "action_type": "Dispatch Coast Guard",
    "triggered_by": "test"
  }'
```

3. Check:
   - Your phone for SMS message (if phone number is valid)
   - Backend logs for delivery status
   - Response shows `"sms_status": "sent"`

### Step 7: Use the Frontend

1. Start frontend:
```bash
cd frontend
npm run dev
```

2. Open `http://localhost:3000`
3. Click any response action button
4. You'll see:
   - Confirmation that action was triggered
   - Which teams were notified
   - SMS delivery status
5. **Check your phone for SMS alerts!**

## SMS Message Examples

Each action sends a specific message to the respective team:

| Action | Team | SMS Message |
|--------|------|-------------|
| Dispatch Coast Guard | Coast Guard | 🚨 COAST GUARD ALERT: Oil spill incident detected. Immediate action required. Check dashboard for details. |
| Mobilize Oil Boom Team | Oil Boom Team | 🚨 OIL BOOM ALERT: Oil spill containment operation initiated. Deploy boom equipment immediately. |
| Initiate Wildlife Response | Wildlife Response Team | 🚨 WILDLIFE ALERT: Marine wildlife rescue needed. Prepare evacuation and care procedures. |
| Dispatch Inventory | Inventory Team | 🚨 INVENTORY ALERT: Emergency supplies required for spill response. Stage equipment for deployment. |

## Troubleshooting

### SMS Not Received
- Check phone number format: Must be `+CountryCodeNumber` (e.g., `+12025551234`)
- Verify `.env` file has correct Twilio credentials
- Check backend logs for errors
- Confirm Twilio account has sufficient trial credits

### Invalid Phone Number
```
Response: "reason": "Invalid phone number format"
```
- Phone must start with `+`
- Include country code
- Example valid formats: `+12025551234`, `+447911123456`

### Authentication Failed
```
Response: "reason": "Invalid Twilio credentials"
```
- Double-check Account SID and Auth Token in `.env`
- Ensure ENABLE_SMS=True
- Restart backend after changing `.env`

### No Backend Response
- Ensure backend is running: `uvicorn app.main:app --reload`
- Check that Twilio SDK is installed: `pip list | grep twilio`
- Reinstall if needed: `pip install --force-reinstall twilio==9.0.4`

## Trial Credits

- Twilio gives $20 trial credit for free accounts
- Each SMS costs ~$0.0075 (varies by country)
- With $20, you get ~2,700 SMS messages
- After trial expires, you'll need a paid plan

## Production Considerations

1. **API Key Security**: Never commit `.env` to version control
2. **Rate Limiting**: Twilio has rate limits for free accounts
3. **Message Content**: Keep messages under 160 characters for single SMS
4. **Whitelisting**: Free accounts can only send to verified numbers
5. **Monitoring**: Check Twilio Console for delivery logs

## Advanced Setup

### Add More Recipients
Edit `backend/app/services/response/team_notification_service.py` to add more teams or modify message templates.

### Custom Phone Numbers Per Team
Teams table supports unique phone numbers. Each team's phone is used for SMS delivery.

### Integration with Multiple SMS Providers
The SMS service is abstracted and can be extended to support:
- AWS SNS
- Azure Communication Services
- Google Cloud Message
- Vonage (Nexmo)

---

**Need Help?**
- Twilio Docs: https://www.twilio.com/docs/sms
- Check backend logs: `tail -f backend.log`
- Verify credentials work: https://console.twilio.com
