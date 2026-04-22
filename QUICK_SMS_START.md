# 🚀 Quick Start: Enable SMS Alerts on Your Phone

## What's Ready
✅ SMS infrastructure fully integrated  
✅ Twilio SDK installed  
✅ Teams configured (Coast Guard, Oil Boom Team, Wildlife Response, Inventory)  
✅ Action-to-team mapping ready  

## 3 Steps to Get SMS Working

### Step 1: Get Free Twilio Account (5 minutes)
1. Visit: **https://www.twilio.com/try-twilio**
2. Sign up for FREE ($20 trial credit)
3. Verify your email & phone
4. In Console, get:
   - **Account SID** (Settings → Account)
   - **Auth Token** (Settings → Account) 
   - **Twilio Phone** (Phone Numbers → Manage)

### Step 2: Configure Backend (2 minutes)

Create `backend/.env` file:
```
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here  
TWILIO_PHONE_NUMBER=+1234567890
ENABLE_SMS=True
```

**Example:**
```
TWILIO_ACCOUNT_SID=AC1234567890abcdefghijklmnop
TWILIO_AUTH_TOKEN=asdfghjklzxcvbnmasdfghjkl
TWILIO_PHONE_NUMBER=+12125551234
ENABLE_SMS=True
```

### Step 3: Test SMS (1 minute)

```bash
cd backend
python test_sms.py
```

Follow prompts to test sending SMS to your phone number.

## Now Test the Full System

### Terminal 1: Start Backend
```bash
cd backend
uvicorn app.main:app --reload
```

### Terminal 2: Start Frontend  
```bash
cd frontend
npm run dev
```

### Test Flow
1. Open http://localhost:3000
2. Click **"Dispatch Coast Guard"** button
3. **Check your phone!** 📱 You should receive an SMS:
   ```
   🚨 COAST GUARD ALERT: Oil spill incident detected. 
   Immediate action required. Check dashboard for details.
   ```
4. UI shows SMS delivery status ✅

## SMS Alert Examples

Each action sends a unique message:

| Action Button | SMS Message |
|---|---|
| Dispatch Coast Guard | 🚨 COAST GUARD ALERT: Oil spill incident detected. Immediate action required. |
| Mobilize Oil Boom Team | 🚨 OIL BOOM ALERT: Oil spill containment operation initiated. |
| Initiate Wildlife Response | 🚨 WILDLIFE ALERT: Marine wildlife rescue needed. |
| Dispatch Inventory | 🚨 INVENTORY ALERT: Emergency supplies required. |

## Frontend Display
When you trigger an action, you'll see:
```
✓ Dispatch Coast Guard triggered successfully

📱 Team SMS Alerts Sent:
┌─────────────────────────────┐
│ Coast Guard                 │
│ +1-202-372-2000            │
│ [SMS SENT] ✓               │
└─────────────────────────────┘
```

## Troubleshooting

### SMS Not Received
- ✓ Check .env file has your credentials
- ✓ Restart backend after updating .env
- ✓ Phone number must include country code (+1234567890)
- ✓ Check Twilio account has trial credits

### Check Status
View backend logs:
```bash
# See SMS delivery logs
tail -f uvicorn_server.log
```

### Test SMS Directly
```bash
cd backend
python test_sms.py
```

## Production Checklist
- [ ] Twilio credentials in `.env`
- [ ] SMS service enabled (`ENABLE_SMS=True`)
- [ ] Team phone numbers verified
- [ ] Test SMS delivered successfully
- [ ] Frontend receives team notifications
- [ ] All 4 action buttons trigger correct SMS

## Next Steps
Once SMS is working:
1. ✅ All response actions now send SMS alerts
2. ✅ Teams receive real-time notifications
3. ✅ You get confirmation in UI
4. Optional: Add email alerts, expand teams

---

**Questions?** Check `SMS_SETUP_GUIDE.md` for detailed troubleshooting.
