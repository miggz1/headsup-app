# main.py - FastAPI backend for sending SMS notifications

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from twilio.rest import Client
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Twilio credentials from environment
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")

# Set up FastAPI app
app = FastAPI()

# Allow frontend running on localhost:3000 to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the shape of appointment data coming in from frontend
class Appointment(BaseModel):
    phone: str
    appointment_time: str

# Define the structure of the full request body
class SMSRequest(BaseModel):
    delay: str
    appointments: List[Appointment]

# Create Twilio client once, reuse it
client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

# Route to handle sending SMS
@app.post("/send_sms")
async def send_sms(data: SMSRequest):
    delay_msg = f"We're currently running {data.delay} minutes behind. Thanks for your patience!"

    success = []
    failure = []

    for appt in data.appointments:
        try:
            message = client.messages.create(
                body=delay_msg,
                from_=TWILIO_PHONE_NUMBER,
                to=appt.phone
            )
            success.append(appt.phone)
        except Exception as e:
            print(f"Failed to send to {appt.phone}: {e}")
            failure.append(appt.phone)

    return {"success": success, "failure": failure}