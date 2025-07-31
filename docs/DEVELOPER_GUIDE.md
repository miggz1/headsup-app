# HeadsUp Developer Guide

## Overview

HeadsUp is an office delay notification system built with React frontend and FastAPI backend. The application allows offices to upload patient appointment CSVs and send SMS delay notifications via Twilio.

**Core Architecture:**
- **Frontend**: React 19.1.0 with Tailwind CSS
- **Backend**: FastAPI with Python 3.8+
- **SMS Service**: Twilio API
- **Data Flow**: Client-side CSV parsing → Backend SMS sending → No persistent storage

## Implementation Status

### ✅ Implemented Features
- CSV file upload and parsing (PapaParse)
- Column mapping for phone/time data
- Appointment categorization (morning/afternoon/evening)
- Patient selection interface with checkboxes
- SMS sending via Twilio API
- Error handling for failed SMS
- CORS configuration for local development

### ❌ Not Implemented (from original spec)
- Manual patient entry for walk-ins
- Custom message templates
- Scheduled notifications
- Patient response handling
- Calendar integration
- Firebase authentication
- Payment flow with Stripe

## Installation & Deployment

### Prerequisites (Beyond User Guide)
- **Python 3.8+** with pip
- **Node.js 16+** with npm
- **Twilio account** with verified phone number
- **Git** for version control

### Development Environment Setup

1. **Clone and setup** (assumes user guide steps completed)
   ```bash
   git clone <repo-url>
   cd headsup-app
   ```

2. **Backend dependencies**
   ```bash
   cd headsup-backend
   pip install -r ../requirements.txt
   ```

3. **Frontend dependencies**
   ```bash
   cd ../headsup-frontend
   npm install
   ```

4. **Environment configuration**
   Create `.env` in root directory:
   ```bash
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_number
   ```

### Production Deployment

**Backend Deployment:**
```bash
# Install production dependencies
pip install -r requirements.txt

# Set environment variables
export TWILIO_ACCOUNT_SID=your_sid
export TWILIO_AUTH_TOKEN=your_token
export TWILIO_PHONE_NUMBER=your_number

# Start production server
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Frontend Deployment:**
```bash
# Build for production
npm run build

# Serve with nginx or similar
# Update CORS settings in main.py for production domain
```

## User Interaction Flow & Code Walkthrough

### 1. Application Startup

**User Experience:**
- User opens `http://localhost:3000`
- Sees HeadsUp title and glass-morphism upload interface
- Background carousel provides visual appeal

**Code Flow:**
- `App.js` renders main layout with `BackgroundCarousel` and `CSVUploader`
- `CSVUploader` component handles all business logic
- Tailwind CSS provides styling via `App.css`

### 2. CSV Upload & Processing

**User Experience:**
- User clicks upload area to select CSV file
- File is processed and column mapping interface appears
- User maps phone and time columns, clicks "Process Appointments"

**Code Flow:**
```javascript
// CSVUploader.js - handleFileChange()
const handleFileChange = (event) => {
  const file = event.target.files[0];
  Papa.parse(file, {
    header: true,
    complete: (results) => {
      setCsvData(results.data);
      setHeaders(results.meta.fields);
    }
  });
};
```

**Key Components:**
- `Papa.parse()` - Client-side CSV parsing
- `csvData` state - Raw CSV data
- `headers` state - Column names for mapping

### 3. Column Mapping

**User Experience:**
- Dropdown menus for phone and time columns
- Validation ensures both columns are selected
- "Process Appointments" button becomes active

**Code Flow:**
```javascript
// CSVUploader.js - handleMapping()
const handleMapping = () => {
  csvData.forEach((row) => {
    const hour = parseInt(time.split(":")[0]);
    const hour24 = isPM && hour < 12 ? hour + 12 : hour;
    
    // Categorize by time of day
    if (hour24 < 12) morning.push(appt);
    else if (hour24 < 17) afternoon.push(appt);
    else evening.push(appt);
  });
};
```

**Key Logic:**
- Time parsing and 24-hour conversion
- Appointment categorization (morning/afternoon/evening)
- Data structure: `{ morning: [], afternoon: [], evening: [] }`

### 4. Patient Selection & Delay Setting

**User Experience:**
- Delay time buttons (15, 30, 45, 60 minutes)
- Group checkboxes for time periods
- Individual patient checkboxes
- Real-time selection count display

**Code Flow:**
```javascript
// CSVUploader.js - toggleGroup()
const toggleGroup = (group) => {
  const groupData = categorizedData[group];
  const isAlreadySelected = groupData.every((appt) =>
    selectedData.find((sel) => sel.phone === appt.phone)
  );
  
  if (isAlreadySelected) {
    // Deselect all in group
    setSelectedData(selectedData.filter((sel) => 
      !groupData.find((g) => g.phone === sel.phone)
    ));
  } else {
    // Select all in group
    setSelectedData([...selectedData, ...groupData]);
  }
};
```

**State Management:**
- `selectedData` - Array of selected appointments
- `delayTime` - Selected delay duration
- `categorizedData` - Appointments grouped by time

### 5. SMS Sending

**User Experience:**
- "Send Notifications" button appears when ready
- User clicks and sees "Sending..." status
- Success/failure count displayed

**Code Flow:**
```javascript
// CSVUploader.js - handleSubmit()
const response = await axios.post("http://127.0.0.1:8000/send_sms", {
  delay: delayTime,
  appointments: selectedData,
});
```

**Backend Processing:**
```python
# main.py - send_sms()
@app.post("/send_sms")
async def send_sms(data: SMSRequest):
    delay_msg = f"We're currently running {data.delay} minutes behind. Thanks for your patience!"
    
    for appt in data.appointments:
        try:
            message = client.messages.create(
                body=delay_msg,
                from_=TWILIO_PHONE_NUMBER,
                to=appt.phone
            )
            success.append(appt.phone)
        except Exception as e:
            failure.append(appt.phone)
    
    return {"success": success, "failure": failure}
```

## Code Architecture

### Frontend Structure
```
src/
├── App.js                 # Main component, layout
├── CSVUploader.js         # Core business logic
├── BackgroundCarousel.js  # UI background component
└── App.css               # Global styles
```

### Backend Structure
```
headsup-backend/
├── main.py               # FastAPI server, SMS endpoint
└── test_twilio.py        # Twilio testing utility
```

### Data Models
```python
# main.py
class Appointment(BaseModel):
    phone: str
    appointment_time: str

class SMSRequest(BaseModel):
    delay: str
    appointments: List[Appointment]
```

### State Management (Frontend)
```javascript
// CSVUploader.js state
const [csvData, setCsvData] = useState([]);           // Raw CSV data
const [headers, setHeaders] = useState([]);            // Column names
const [phoneColumn, setPhoneColumn] = useState("");    // Selected phone column
const [timeColumn, setTimeColumn] = useState("");      // Selected time column
const [categorizedData, setCategorizedData] = useState({}); // Grouped appointments
const [selectedData, setSelectedData] = useState([]);  // Selected patients
const [delayTime, setDelayTime] = useState("");        // Delay duration
const [statusMessage, setStatusMessage] = useState(""); // UI status
```

## Known Issues

### Minor Issues
1. **No input validation** - Phone numbers not validated before sending
2. **No error recovery** - Failed SMS don't retry automatically
3. **Memory usage** - Large CSV files held in memory
4. **No loading states** - Limited feedback during processing
5. **Hardcoded styling** - Inline styles instead of Tailwind classes

### Major Issues
1. **No authentication** - Anyone can access the application
2. **CORS hardcoded** - Only works with localhost:3000
3. **No rate limiting** - Could spam Twilio API
4. **No logging** - Difficult to debug production issues
5. **No error boundaries** - React errors crash entire app

### Performance Issues
1. **Client-side parsing** - Large CSV files block UI
2. **Synchronous SMS sending** - No batching or queuing
3. **No caching** - Repeated operations re-process data
4. **Memory leaks** - State not cleared on component unmount

## Future Work

### High Priority
1. **Manual patient entry** - Form for walk-in patients
2. **Input validation** - Phone number and time format validation
3. **Error handling** - Comprehensive error boundaries and recovery
4. **Authentication** - Firebase or similar auth system
5. **Production deployment** - Docker containers, proper hosting

### Medium Priority
1. **Custom message templates** - Template editor with variables
2. **Scheduled notifications** - Delayed sending capability
3. **Patient responses** - Two-way SMS handling
4. **Calendar integration** - Google Calendar API
5. **Payment integration** - Stripe for premium features

### Low Priority
1. **Analytics dashboard** - Usage statistics and reporting
2. **Multi-tenant support** - Multiple dental offices
3. **Mobile app** - React Native version
4. **API documentation** - OpenAPI/Swagger docs
5. **Unit tests** - Comprehensive test coverage

## Ongoing Development

### Code Quality
- **Linting**: Add ESLint for JavaScript, flake8 for Python
- **Testing**: Jest for frontend, pytest for backend
- **Type safety**: TypeScript migration for frontend
- **Documentation**: JSDoc for functions, docstrings for Python

### Deployment Pipeline
- **CI/CD**: GitHub Actions for automated testing
- **Docker**: Containerization for consistent environments
- **Monitoring**: Application performance monitoring
- **Backup**: Database backups (when implemented)

### Scalability Considerations
- **Database**: PostgreSQL for persistent storage
- **Caching**: Redis for session management
- **Queue system**: Celery for background SMS processing
- **Load balancing**: Multiple backend instances
- **CDN**: Static asset delivery optimization

### Security Enhancements
- **Input sanitization** - Prevent XSS and injection attacks
- **Rate limiting** - Prevent API abuse
- **Audit logging** - Track all SMS sent
- **Data encryption** - Encrypt sensitive data at rest
- **HTTPS enforcement** - Secure all communications

## Development Workflow

### Feature Development
1. **Create feature branch**: `git checkout -b feature-name`
2. **Write tests first**: TDD approach for new features
3. **Implement feature**: Follow existing code patterns
4. **Update documentation**: Keep docs in sync with code
5. **Submit PR**: Include tests and documentation

### Bug Fixes
1. **Reproduce issue**: Create minimal test case
2. **Fix in isolation**: Don't mix fixes with features
3. **Add regression test**: Prevent future occurrences
4. **Update changelog**: Document the fix

### Code Review Checklist
- [ ] Tests pass (unit and integration)
- [ ] No console errors or warnings
- [ ] Security considerations addressed
- [ ] Performance impact assessed
- [ ] Documentation updated
- [ ] Error handling implemented
- [ ] Accessibility standards met

---

**Note**: This guide assumes familiarity with React, FastAPI, and Twilio. For detailed API documentation, see the [Twilio API docs](https://www.twilio.com/docs) and [FastAPI docs](https://fastapi.tiangolo.com/). 