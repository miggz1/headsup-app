from twilio.rest import Client
import os
from dotenv import load_dotenv

load_dotenv()  # This loads .env from the current directory


account_sid = os.getenv("TWILIO_ACCOUNT_SID")
auth_token = os.getenv("TWILIO_AUTH_TOKEN")
twilio_number = os.getenv("TWILIO_PHONE_NUMBER")

client = Client(account_sid, auth_token)

message = client.messages.create(
    body="Hello from HeadsUp test!",
    from_=twilio_number,
    to="7329772697"
)

print(f"Message sent! SID: {message.sid}")

