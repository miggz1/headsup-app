# HeadsUp - Dental Office Delay Notification System

A lightweight delay messaging tool for dental offices to notify patients about appointment delays via SMS. Built with React frontend and FastAPI backend, using Twilio for SMS delivery.

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- A Twilio account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd headsup-app
   ```

2. **Set up the backend**
   ```bash
   cd headsup-backend
   pip install -r ../requirements.txt
   ```

3. **Set up the frontend**
   ```bash
   cd ../headsup-frontend
   npm install
   ```

## 🔑 API Key Setup

### Twilio Account Setup

1. **Sign up for Twilio** (https://www.twilio.com)
   - Free tier includes 1 phone number and limited SMS credits
   - Verify your personal phone number during signup

2. **Get your Twilio credentials**
   - Go to your Twilio Console
   - Find your Account SID and Auth Token
   - Note your Twilio phone number

3. **Create environment file**
   Create a `.env` file in the root directory:
   ```bash
   # .env file example
   TWILIO_ACCOUNT_SID=your_sid_here
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_PHONE_NUMBER=+1234567890
   ```

   ⚠️ **Important**: Never commit your `.env` file to version control!

## 🏃‍♂️ Running the Application

### Start the Backend
```bash
cd headsup-backend
uvicorn main:app --reload --port 8000
```
The backend will run on `http://127.0.0.1:8000`

**Alternative startup methods:**
```bash
# If you prefer python directly
python -m uvicorn main:app --reload --port 8000

# For production (no reload)
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Start the Frontend
```bash
cd headsup-frontend
npm start
```
The frontend will run on `http://localhost:3000`

## 📱 How to Use HeadsUp

### Step 1: Prepare Your CSV File
Create a CSV file with your patient appointments. The file should have columns for:
- **Phone numbers** (in any format: +1-555-123-4567, 555-123-4567, etc.)
- **Appointment times** (in any format: 9:00 AM, 14:30, etc.)

Example CSV format:
```csv
Phone,Time,Patient Name
+1-555-123-4567,9:00 AM,John Doe
555-987-6543,2:30 PM,Jane Smith
```

### Step 2: Upload and Process
1. **Upload your CSV file** by clicking the upload area
2. **Map your columns**:
   - Select which column contains phone numbers
   - Select which column contains appointment times
3. **Click "Process Appointments"** to categorize appointments by time of day

### Step 3: Select Patients and Set Delay
1. **Choose delay time** (15 min, 30 min, 45 min, or 1 hour)
2. **Select patients** to notify:
   - Use checkboxes to select individual patients
   - Use group checkboxes to select all morning/afternoon/evening appointments
3. **Review your selection** - you'll see how many patients will be notified

### Step 4: Send Notifications
1. **Click "Send Notifications"**
2. **Wait for confirmation** - you'll see success/failure counts
3. **Messages sent** - patients receive: "We're currently running [X] minutes behind. Thanks for your patience!"

## 📋 CSV File Requirements

### Supported Formats
- **Phone numbers**: Any format (Twilio will normalize them)
- **Times**: Any readable time format (AM/PM, 24-hour, etc.)
- **File size**: Under 10MB
- **Encoding**: UTF-8 recommended

### Example CSV Files

**Simple format:**
```csv
Phone,Time
555-123-4567,9:00 AM
555-987-6543,2:30 PM
```

**Detailed format:**
```csv
Patient Phone,Appointment Time,Patient Name,Procedure
+1-555-123-4567,9:00 AM,John Doe,Cleaning
555-987-6543,2:30 PM,Jane Smith,Checkup
```

## ⚠️ Common Issues & Solutions

### "Failed to send SMS" Errors
- **Check Twilio credentials** in your `.env` file
- **Verify phone number format** - Twilio needs country codes
- **Check Twilio account balance** - free tier has limits
- **Ensure backend is running** on port 8000

### "Backend connection failed"
- **Start the backend**: `uvicorn main:app --reload --port 8000`
- **Check port 8000** isn't in use by another application
- **Verify CORS settings** if using different ports
- **Try alternative startup**: `python -m uvicorn main:app --reload --port 8000`

### CSV Upload Issues
- **Check file format** - must be .csv
- **Verify column mapping** - select correct phone and time columns
- **Try smaller file** - break large files into smaller chunks

### No Appointments Showing
- **Check CSV format** - ensure phone and time columns have data
- **Verify column selection** - make sure you've mapped the right columns
- **Check for empty rows** - remove any completely empty rows

## 🔒 Privacy & Security

### Data Handling
- **No data storage** - all patient data is processed in memory only
- **No database** - information is never saved to disk
- **HIPAA compliant** - no PHI storage means no HIPAA requirements
- **Session-based** - data is cleared when you refresh the page

### SMS Compliance
- **One-way messaging** - patients cannot reply
- **Standard templates** - no custom PHI in messages
- **Twilio compliance** - follows Twilio's messaging guidelines

## 🚧 Current Limitations

### Known Issues
- **No manual entry** - currently only supports CSV uploads
- **No message customization** - uses standard delay templates only
- **No scheduling** - messages sent immediately when button is clicked
- **No confirmation replies** - patients cannot confirm receipt

### Planned Features
- Manual patient entry for walk-ins
- Custom message templates
- Scheduled notifications
- Patient response handling
- Calendar integration

## 🛠️ Technical Support

### Development Setup
For developers wanting to contribute or modify the code, see the [Developer Documentation](./DEVELOPER.md).

### Getting Help
- **Check the console** (F12) for JavaScript errors
- **Check backend logs** for Python errors
- **Verify Twilio credentials** are correct
- **Test with a small CSV file** first

## 📞 Support

If you encounter issues not covered in this guide:
1. Check the browser console for error messages
2. Verify your Twilio account is active
3. Test with a simple 2-row CSV file
4. Ensure both frontend and backend are running

---

**HeadsUp** - Making dental office delays less frustrating, one SMS at a time.
