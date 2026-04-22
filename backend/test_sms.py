"""
Test SMS configuration and send a test message.
Usage: python test_sms.py
"""

import sys
import os

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.services.alerts.sms_service import sms_service


def test_sms_configuration():
    """Test SMS service configuration"""
    print("=" * 60)
    print("SMS Configuration Test")
    print("=" * 60)

    print("\n1. Checking Configuration:")
    print(f"   ✓ Enable SMS: {settings.enable_sms}")
    print(f"   ✓ Account SID: {settings.twilio_account_sid[:10]}..." if settings.twilio_account_sid else "   ✗ Account SID: NOT SET")
    print(f"   ✓ Auth Token: {settings.twilio_auth_token[:10]}..." if settings.twilio_auth_token else "   ✗ Auth Token: NOT SET")
    print(f"   ✓ Phone Number: {settings.twilio_phone_number}" if settings.twilio_phone_number else "   ✗ Phone Number: NOT SET")

    if not settings.enable_sms:
        print("\n⚠️  SMS is DISABLED. Set ENABLE_SMS=True in .env to enable")
        return False

    if not all([settings.twilio_account_sid, settings.twilio_auth_token, settings.twilio_phone_number]):
        print("\n✗ Missing Twilio credentials. Update .env file:")
        print("  - TWILIO_ACCOUNT_SID")
        print("  - TWILIO_AUTH_TOKEN")
        print("  - TWILIO_PHONE_NUMBER")
        return False

    print("\n2. Configuration Status: ✓ VALID\n")
    return True


def send_test_sms(phone_number: str):
    """Send a test SMS"""
    if not phone_number.startswith("+"):
        print(f"✗ Invalid phone number format: {phone_number}")
        print("  Phone must start with + (e.g., +12025551234)")
        return

    print(f"3. Sending Test SMS:")
    print(f"   From: {sms_service.from_number}")
    print(f"   To: {phone_number}")
    print(f"   Message: Test SMS from Marine Oil Spill Detection System")

    result = sms_service.send_sms(phone_number, "🚨 TEST SMS: Marine Oil Spill Detection System - SMS is working!")

    if result.get("success"):
        print(f"\n✓ SMS SENT SUCCESSFULLY!")
        print(f"  Message SID: {result.get('message_sid')}")
        print(f"  Status: {result.get('status')}")
        return True
    else:
        print(f"\n✗ SMS FAILED TO SEND")
        print(f"  Reason: {result.get('reason')}")
        print(f"  Status: {result.get('status')}")
        return False


if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("MARINE OIL SPILL DETECTION - SMS TEST UTILITY")
    print("=" * 60 + "\n")

    # Test configuration
    if not test_sms_configuration():
        print("\n⚠️  SMS Configuration Incomplete")
        print("\nTo enable SMS:")
        print("1. Sign up for Twilio: https://www.twilio.com/try-twilio")
        print("2. Get your Account SID and Auth Token")
        print("3. Get a Twilio phone number")
        print("4. Update backend/.env with your credentials")
        print("5. Restart the backend server")
        print("6. Run this test again\n")
        sys.exit(1)

    # Get phone number from user
    print("\n4. Testing SMS Delivery:")
    phone_number = input("   Enter phone number to test (format: +12025551234): ").strip()

    if not phone_number:
        print("   ✗ No phone number provided")
        sys.exit(1)

    # Send test SMS
    success = send_test_sms(phone_number)

    print("\n" + "=" * 60)
    if success:
        print("✓ SMS TEST COMPLETED SUCCESSFULLY")
        print("\nYou should receive a test SMS shortly.")
        print("Response actions will now send SMS alerts to teams!\n")
    else:
        print("✗ SMS TEST FAILED")
        print("\nTroubleshooting:")
        print("- Check phone number format (must include country code and start with +)")
        print("- Verify Twilio credentials in .env")
        print("- Check backend logs for details")
        print("- Ensure Twilio account has trial credits available\n")
    print("=" * 60 + "\n")
