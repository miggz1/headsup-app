# HeadsUp Developer Documentation

This document contains technical details for developers working on the HeadsUp project.

## 🏗️ Architecture Overview

### Tech Stack
- **Frontend**: React 19.1.0 with Tailwind CSS
- **Backend**: FastAPI with Python 3.8+
- **SMS Service**: Twilio API
- **Build Tools**: Create React App, Uvicorn

### Project Structure
```
headsup-app/
├── headsup-backend/          # FastAPI backend
│   ├── main.py              # Main API server
│   └── test_twilio.py       # Twilio testing utilities
├── headsup-frontend/         # React frontend
│   ├── src/
│   │   ├── App.js           # Main React component
│   │   ├── CSVUploader.js   # CSV processing component
│   │   └── BackgroundCarousel.js # UI background
│   └── package.json         # Node dependencies
├── requirements.txt          # Python dependencies
└── .env                     # Environment variables (not in repo)
```

## 🔧 Development Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git

### Local Development

1. **Clone and setup**
   ```bash
   git clone <repo-url>
   cd headsup-app
   ```

2. **Backend setup**
   ```bash
   cd headsup-backend
   pip install -r ../requirements.txt
   ```

3. **Frontend setup**
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

5. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd headsup-backend
   uvicorn main:app --reload --port 8000
   
   # Alternative backend startup methods:
   # python -m uvicorn main:app --reload --port 8000
   # uvicorn main:app --reload --host 0.0.0.0 --port 8000
   
   # Terminal 2 - Frontend
   cd headsup-frontend
   npm start
   ```

## 📡 API Documentation

### Backend Endpoints

#### POST `/send_sms`
Sends SMS notifications to selected patients.

**Request Body:**
```json
{
  "delay": "30",
  "appointments": [
    {
      "phone": "+15551234567",
      "appointment_time": "9:00 AM"
    }
  ]
}
```

**Response:**
```json
{
  "success": ["+15551234567"],
  "failure": []
}
```

**Error Responses:**
- `400 Bad Request`: Invalid request format
- `500 Internal Server Error`: Twilio API errors

### Frontend Components

#### CSVUploader Component
Main component handling CSV upload and SMS sending.

**Key Features:**
- CSV parsing with PapaParse
- Column mapping for phone/time data
- Appointment categorization (morning/afternoon/evening)
- Patient selection interface
- SMS sending via axios

**State Management:**
```javascript
const [csvData, setCsvData] = useState([]);
const [headers, setHeaders] = useState([]);
const [phoneColumn, setPhoneColumn] = useState("");
const [timeColumn, setTimeColumn] = useState("");
const [categorizedData, setCategorizedData] = useState({});
const [selectedData, setSelectedData] = useState([]);
const [delayTime, setDelayTime] = useState("");
```

## 🔒 Security Considerations

### Data Privacy
- **No persistent storage**: All data processed in memory only
- **No database**: Avoids HIPAA compliance requirements
- **Session-based**: Data cleared on page refresh
- **No PHI in messages**: Uses generic delay templates

### API Security
- **CORS configuration**: Limited to localhost:3000
- **Environment variables**: Sensitive data in .env file
- **Input validation**: Pydantic models for request validation
- **Error handling**: No sensitive data in error messages

## 🧪 Testing

### Backend Testing
```bash
cd headsup-backend
python -m pytest
```

### Frontend Testing
```bash
cd headsup-frontend
npm test
```

### Twilio Testing
Use `test_twilio.py` to verify Twilio credentials:
```bash
cd headsup-backend
python test_twilio.py
```

## 🚀 Deployment

### Backend Deployment
1. **Requirements**: Python 3.8+, pip
2. **Install dependencies**: `pip install -r requirements.txt`
3. **Set environment variables**: Configure .env file
4. **Start server**: `uvicorn main:app --host 0.0.0.0 --port 8000`

### Frontend Deployment
1. **Build**: `npm run build`
2. **Serve**: Use nginx or similar to serve static files
3. **CORS**: Update backend CORS settings for production domain

### Environment Variables
Required for production:
```bash
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
```

## 🔧 Configuration

### Backend Configuration
- **CORS origins**: Update in `main.py` for production
- **Port**: Default 8000, configurable via uvicorn
- **Logging**: Add logging configuration for production

### Frontend Configuration
- **API endpoint**: Update axios base URL for production
- **Build optimization**: Configure webpack for production
- **Environment variables**: Use REACT_APP_ prefix for client-side vars

## 🐛 Debugging

### Common Issues

#### Backend Issues
1. **Twilio authentication errors**
   - Verify .env file exists and has correct credentials
   - Check Twilio account status and balance

2. **CORS errors**
   - Ensure frontend is running on localhost:3000
   - Check CORS middleware configuration

3. **Port conflicts**
   - Change port: `uvicorn main:app --port 8001`
   - Update frontend API calls accordingly

#### Frontend Issues
1. **CSV parsing errors**
   - Check file format and encoding
   - Verify column mapping selections

2. **API connection errors**
   - Ensure backend is running
   - Check network connectivity
   - Verify API endpoint URL

### Debug Tools
- **Backend**: Use `print()` statements or Python debugger
- **Frontend**: Browser developer tools (F12)
- **Network**: Check Network tab for API calls
- **Console**: Monitor for JavaScript errors

## 📊 Performance Considerations

### Backend Performance
- **Memory usage**: CSV data held in memory only
- **API calls**: Batch SMS sending for large datasets
- **Error handling**: Graceful degradation for failed SMS

### Frontend Performance
- **CSV parsing**: Client-side parsing reduces server load
- **UI responsiveness**: Debounced user interactions
- **Memory management**: Clear state on component unmount

## 🔄 Future Enhancements

### Planned Features
1. **Manual patient entry**
   - Form for walk-in patients
   - Phone number validation

2. **Custom message templates**
   - Template editor
   - Variable substitution

3. **Scheduled notifications**
   - Delayed sending
   - Recurring notifications

4. **Patient responses**
   - Two-way SMS
   - Response handling

5. **Calendar integration**
   - Google Calendar API
   - Outlook integration

### Technical Debt
- **Error handling**: More comprehensive error messages
- **Validation**: Client-side form validation
- **Testing**: Unit and integration tests
- **Documentation**: API documentation with OpenAPI
- **Monitoring**: Application metrics and logging

## 🤝 Contributing

### Development Workflow
1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature-name`
3. **Make changes**: Follow coding standards
4. **Test thoroughly**: Run all tests
5. **Submit pull request**: Include description of changes

### Coding Standards
- **Python**: PEP 8 style guide
- **JavaScript**: ESLint configuration
- **React**: Functional components with hooks
- **API**: RESTful design principles

### Code Review Checklist
- [ ] Tests pass
- [ ] No console errors
- [ ] Security considerations addressed
- [ ] Documentation updated
- [ ] Performance impact assessed

---

For user-facing documentation, see [README.md](./README.md). 