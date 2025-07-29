// Here we import React so we can use React features like state
import React, { useState, useEffect } from "react";
// Axios enables HTTP requests to FastAPI backend
import axios from "axios";
// PapaParse lets us parse CSVs directly in the browser
import Papa from "papaparse";

function CSVUploader() {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [phoneColumn, setPhoneColumn] = useState("");
  const [timeColumn, setTimeColumn] = useState("");
  const [categorizedData, setCategorizedData] = useState({ morning: [], afternoon: [], evening: [] });
  const [selectedData, setSelectedData] = useState([]);
  const [delayTime, setDelayTime] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file) => {
    setFileName(file.name);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        setCsvData(results.data);
        setHeaders(results.meta.fields);
      },
    });
  };

  const handleMapping = () => {
    if (!phoneColumn || !timeColumn) return;

    const morning = [];
    const afternoon = [];
    const evening = [];

    csvData.forEach((row) => {
      const phone = row[phoneColumn];
      const time = row[timeColumn];
      if (!phone || !time) return;

      const hour = parseInt(time.split(":")[0]);
      const isPM = time.toLowerCase().includes("pm");
      const hour24 = isPM && hour < 12 ? hour + 12 : hour;

      const appt = { phone, appointment_time: time };

      if (hour24 < 12) {
        morning.push(appt);
      } else if (hour24 < 17) {
        afternoon.push(appt);
      } else {
        evening.push(appt);
      }
    });

    setCategorizedData({ morning, afternoon, evening });
  };

  const toggleGroup = (group) => {
    const groupData = categorizedData[group];
    const isAlreadySelected = groupData.every((appt) =>
      selectedData.find((sel) => sel.phone === appt.phone)
    );

    if (isAlreadySelected) {
      setSelectedData(selectedData.filter((sel) => !groupData.find((g) => g.phone === sel.phone)));
    } else {
      setSelectedData([...selectedData, ...groupData.filter((g) => !selectedData.find((s) => s.phone === g.phone))]);
    }
  };

  const toggleSingle = (appt) => {
    const exists = selectedData.find((s) => s.phone === appt.phone);
    if (exists) {
      setSelectedData(selectedData.filter((s) => s.phone !== appt.phone));
    } else {
      setSelectedData([...selectedData, appt]);
    }
  };

  const handleSubmit = async () => {
    if (!delayTime || selectedData.length === 0) return;
    setStatusMessage("Sending...");

    try {
      const response = await axios.post("http://127.0.0.1:8000/send_sms", {
        delay: delayTime,
        appointments: selectedData,
      });

      const { success, failure } = response.data;
      setStatusMessage(`✅ Sent to ${success.length} patients. ❌ Failed: ${failure.length}`);
    } catch (error) {
      console.error(error);
      setStatusMessage("❌ Something went wrong. Try again later.");
    }
  };

  const buttonStyle = {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    width: '100%'
  };

  const buttonHoverStyle = {
    backgroundColor: '#1d4ed8'
  };

  const disabledButtonStyle = {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed'
  };

  const delayButtonStyle = {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    backgroundColor: 'white',
    color: '#374151'
  };

  const selectedDelayButtonStyle = {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
    color: '#1d4ed8'
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* File Upload */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>Upload CSV File</h2>
        
        <div style={{ position: 'relative' }}>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
          />
          <div style={{ border: '2px dashed #d1d5db', borderRadius: '8px', padding: '24px', textAlign: 'center' }}>
            <p style={{ color: '#6b7280' }}>
              {fileName ? fileName : "Click to select CSV file"}
            </p>
          </div>
        </div>
      </div>

      {/* Column Mapping */}
      {headers.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>Map CSV Columns</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Phone Number Column</label>
              <select
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                value={phoneColumn}
                onChange={(e) => setPhoneColumn(e.target.value)}
              >
                <option value="">Select column...</option>
                {headers.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Appointment Time Column</label>
              <select
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                value={timeColumn}
                onChange={(e) => setTimeColumn(e.target.value)}
              >
                <option value="">Select column...</option>
                {headers.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleMapping}
            disabled={!phoneColumn || !timeColumn}
            style={{
              ...buttonStyle,
              ...((!phoneColumn || !timeColumn) ? disabledButtonStyle : {})
            }}
            onMouseEnter={(e) => {
              if (!(!phoneColumn || !timeColumn)) {
                e.target.style.backgroundColor = buttonHoverStyle.backgroundColor;
              }
            }}
            onMouseLeave={(e) => {
              if (!(!phoneColumn || !timeColumn)) {
                e.target.style.backgroundColor = buttonStyle.backgroundColor;
              }
            }}
          >
            Process Appointments
          </button>
        </div>
      )}

      {/* Delay Selection */}
      {Object.values(categorizedData).some(group => group.length > 0) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>Set Delay Time</h3>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { value: "15", label: "15 min" },
              { value: "30", label: "30 min" },
              { value: "45", label: "45 min" },
              { value: "60", label: "1 hour" }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setDelayTime(option.value)}
                style={{
                  ...delayButtonStyle,
                  ...(delayTime === option.value ? selectedDelayButtonStyle : {})
                }}
                onMouseEnter={(e) => {
                  if (delayTime !== option.value) {
                    e.target.style.backgroundColor = '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (delayTime !== option.value) {
                    e.target.style.backgroundColor = delayButtonStyle.backgroundColor;
                  }
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Appointment Selection */}
      {Object.values(categorizedData).some(group => group.length > 0) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>Select Appointments</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {['morning', 'afternoon', 'evening'].map((label) => (
              categorizedData[label].length > 0 && (
                <div key={label} style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                  <div style={{ padding: '12px 16px', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input
                          type="checkbox"
                          style={{ width: '16px', height: '16px', accentColor: '#2563eb' }}
                          onChange={() => toggleGroup(label)}
                          checked={categorizedData[label].every((appt) =>
                            selectedData.find((s) => s.phone === appt.phone)
                          )}
                        />
                        <span style={{ fontWeight: '500', color: '#111827', textTransform: 'capitalize' }}>
                          {label} ({categorizedData[label].length})
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead style={{ backgroundColor: '#f9fafb' }}>
                        <tr>
                          <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Select
                          </th>
                          <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Phone
                          </th>
                          <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Time
                          </th>
                        </tr>
                      </thead>
                      <tbody style={{ backgroundColor: 'white' }}>
                        {categorizedData[label].map((appt, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                              <input
                                type="checkbox"
                                style={{ width: '16px', height: '16px', accentColor: '#2563eb' }}
                                checked={selectedData.some((s) => s.phone === appt.phone)}
                                onChange={() => toggleSingle(appt)}
                              />
                            </td>
                            <td style={{ padding: '12px 16px', whiteSpace: 'nowrap', fontSize: '14px', color: '#111827' }}>
                              {appt.phone}
                            </td>
                            <td style={{ padding: '12px 16px', whiteSpace: 'nowrap', fontSize: '14px', color: '#6b7280' }}>
                              {appt.appointment_time}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* Send SMS */}
      {selectedData.length > 0 && delayTime && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontWeight: '500', color: '#1e40af' }}>Ready to Send</p>
                <p style={{ fontSize: '14px', color: '#1d4ed8' }}>
                  {selectedData.length} patients • {delayTime}-minute delay
                </p>
              </div>
              <button
                onClick={handleSubmit}
                style={buttonStyle}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = buttonHoverStyle.backgroundColor;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = buttonStyle.backgroundColor;
                }}
              >
                Send Notifications
              </button>
            </div>
          </div>
          
          {statusMessage && (
            <div style={{
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid',
              ...(statusMessage.includes('✅') 
                ? { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534' }
                : { backgroundColor: '#fef2f2', borderColor: '#fecaca', color: '#991b1b' }
              )
            }}>
              {statusMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CSVUploader;