# Step 1: Start the App with a button tap (no Firebase Auth, just local)
# I used a FastAPI backend which will eventually handle sending SMS messages.
# For Step 1, this code is intended to just set up a FastAPI project instance and make sure it's running locally


# Import FastAPI
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import csv
from io import StringIO

#Created the FastAPI instance
app = FastAPI()

# This was tricky and not totally sure what's happening here. I found a snippet in docs that suggests for "allowing for cross-origin requests so the React frontend can talk to this backend"
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (you can restrict this later)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Created a simple root route to test the app
@app.get("/")
def read_root():
    return {"message": "HeadsUp FastAPI backend is running!"}

# Upload the csv file and parse it
# According to the docs, this endpoint will allow for uploading a CSV file from the frontend.
# Here we'll parse the CSV and return the data as JSON, without storing anything.


@app.post("/upload_csv")
async def upload_csv(file: UploadFile = File(...)):
    # Read the contents of the uploaded file
    contents = await file.read()

    # Convert bytes to string for CSV parsing
    decoded = contents.decode("utf-8")

    # Use StringIO to treat the string like a file object
    csv_file = StringIO(decoded)

    # Create a CSV reader
    reader = csv.DictReader(csv_file)

    # Convert CSV rows to a list of dictionaries
    data = [row for row in reader]

    # Return the parsed data as JSON
    return {"appointments": data}



# To run this file locally:
#     1. Save this file as main.py
#     2. Install FastAPI and Uvicorn with:
#        pip install fastapi uvicorn
#     3. Start the server with:
#        uvicorn main:app --reload

# After starting, visit http://127.0.0.1:8000 in your browser to test the backend