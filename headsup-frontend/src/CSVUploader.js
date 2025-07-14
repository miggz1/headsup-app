// Here we import React so we can use React features like state
import React, { useState } from "react";

// Axios enables HTTP requests to FastAPI backend
import axios from "axios";

// PapaParse lets us parse CSVs directly in the browser
import Papa from "papaparse";

// Define function called CSVUploader
function CSVUploader() {
  // State to store full CSV data
  const [csvData, setCsvData] = useState([]);
  // Store headers from CSV
  const [headers, setHeaders] = useState([]);
  // User-selected mappings
  const [phoneColumn, setPhoneColumn] = useState("");
  const [timeColumn, setTimeColumn] = useState("");
  // Extracted data we want to preview and send
  const [selectedData, setSelectedData] = useState([]);

  // This function runs when a user selects a file
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (!file) return;

    Papa.parse(file, {
      header: true, // Treat first row as header
      skipEmptyLines: true,
      complete: function (results) {
        setCsvData(results.data); // Save all rows of CSV
        setHeaders(results.meta.fields); // Save header names
      },
    });
  };

  // Extract only the user-mapped columns (phone + time)
  const handleMapping = () => {
    if (!phoneColumn || !timeColumn) return;

    const extracted = csvData.map((row) => ({
      phone: row[phoneColumn],
      appointment_time: row[timeColumn],
    }));

    setSelectedData(extracted); // Store for preview
  };

  // Upload extracted data to backend
  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/upload_csv", {
        appointments: selectedData,
      });

      console.log("Response from backend:", response.data);
    } catch (error) {
      console.error("Something went wrong uploading the data:", error);
    }
  };

  // The return statement defines what we see on the web page (the UI)
  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-2">Upload and Map Appointments CSV</h2>

      {/* CSV Upload Input */}
      <input type="file" accept=".csv" onChange={handleFileChange} className="mb-4" />

      {/* Column Mapping Dropdowns */}
      {headers.length > 0 && (
        <div className="space-y-4 mb-4">
          <div>
            <label className="block">Select Phone Number Column:</label>
            <select
              className="border p-2 w-full"
              value={phoneColumn}
              onChange={(e) => setPhoneColumn(e.target.value)}
            >
              <option value="">-- Choose --</option>
              {headers.map((header) => (
                <option key={header} value={header}>{header}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block">Select Appointment Time Column:</label>
            <select
              className="border p-2 w-full"
              value={timeColumn}
              onChange={(e) => setTimeColumn(e.target.value)}
            >
              <option value="">-- Choose --</option>
              {headers.map((header) => (
                <option key={header} value={header}>{header}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleMapping}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Confirm Mapping
          </button>
        </div>
      )}

      {/* If mapped data exists, show it and allow upload */}
      {selectedData.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold">Mapped Appointment Preview:</h3>
          <table className="border border-collapse w-full text-sm mt-2">
            <thead>
              <tr>
                <th className="border px-2 py-1 bg-gray-100">Phone</th>
                <th className="border px-2 py-1 bg-gray-100">Appointment Time</th>
              </tr>
            </thead>
            <tbody>
              {selectedData.map((row, idx) => (
                <tr key={idx}>
                  <td className="border px-2 py-1">{row.phone}</td>
                  <td className="border px-2 py-1">{row.appointment_time}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Upload extracted appointment info */}
          <button
            onClick={handleSubmit}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
          >
            Send to Backend
          </button>
        </div>
      )}
    </div>
  );
}

// Make this component available to other files like App.js
export default CSVUploader;