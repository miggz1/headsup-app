from twilio.rest import Client
from dotenv import load_dotenv
from pathlib import Path
import os

# Set the path to your .env file
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

# Twilio credentials from .env
from twilio.rest import Client

account_sid = os.getenv("TWILIO_ACCOUNT_SID")
auth_token = os.getenv("TWILIO_AUTH_TOKEN")
twilio_number = os.getenv("TWILIO_PHONE_NUMBER")

# Create Twilio client
client = Client(account_sid, auth_token)

# Send a test message
message = client.messages.create(
    body="Hello from HeadsUp test!",
    from_=twilio_number,
    to="+17329772697"  # <- Replace with your verified phone number
)

print(f"✅ Message sent! SID: {message.sid}")

