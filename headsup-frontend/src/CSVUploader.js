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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

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

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-2">Upload and Map Appointments CSV</h2>

      <input type="file" accept=".csv" onChange={handleFileChange} className="mb-4" />

      {headers.length > 0 && (
        <div className="space-y-4 mb-4">
          <label>Select Phone Number Column:</label>
          <select className="border p-2 w-full" value={phoneColumn} onChange={(e) => setPhoneColumn(e.target.value)}>
            <option value="">-- Choose --</option>
            {headers.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>

          <label>Select Appointment Time Column:</label>
          <select className="border p-2 w-full" value={timeColumn} onChange={(e) => setTimeColumn(e.target.value)}>
            <option value="">-- Choose --</option>
            {headers.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>

          <button onClick={handleMapping} className="bg-blue-500 text-white px-4 py-2 rounded">Confirm Mapping</button>
        </div>
      )}

      {Object.values(categorizedData).some(group => group.length > 0) && (
        <div className="mb-4">
          <label>Select Delay Time:</label>
          <select className="border p-2 w-full" value={delayTime} onChange={(e) => setDelayTime(e.target.value)}>
            <option value="">-- Select --</option>
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">1 hour</option>
          </select>
        </div>
      )}

      {['morning', 'afternoon', 'evening'].map((label) => (
        categorizedData[label].length > 0 && (
          <div key={label} className="mt-4">
            <h3 className="font-bold capitalize mb-2">
              <input
                type="checkbox"
                className="mr-2"
                onChange={() => toggleGroup(label)}
                checked={categorizedData[label].every((appt) =>
                  selectedData.find((s) => s.phone === appt.phone)
                )}
              />
              {label} Appointments
            </h3>
            <table className="border w-full text-sm">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Phone</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {categorizedData[label].map((appt, i) => (
                  <tr key={i}>
                    <td className="border p-1">
                      <input
                        type="checkbox"
                        checked={selectedData.some((s) => s.phone === appt.phone)}
                        onChange={() => toggleSingle(appt)}
                      />
                    </td>
                    <td className="border p-1">{appt.phone}</td>
                    <td className="border p-1">{appt.appointment_time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ))}

      {selectedData.length > 0 && delayTime && (
        <div className="mt-6">
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Send SMS to {selectedData.length} Patients
          </button>
          {statusMessage && <p className="mt-2 text-sm text-gray-800">{statusMessage}</p>}
        </div>
      )}
    </div>
  );
}

export default CSVUploader;