// Here we import React so we can use React features like state
import React, { useState } from "react";

// Axios enables HTTP requests to FastAPI backend
import axios from "axios";

// Define function called CSVUploader
function CSVUploader() {
  // This holds the selected file from user's computer
  const [file, setFile] = useState(null);

  // This holds the data we get back from the server after upload
  const [data, setData] = useState([]);

  // This function runs when a user selects a file
  const handleFileChange = (event) => {
    setFile(event.target.files[0]); // Save the selected file in our state
  };

  // This function runs when the user submits the form (uploads the file)
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the page from reloading

    // Don't continue if there's no file
    if (!file) return;

    // Create a new form object that we will send to the backend
    const formData = new FormData();
    formData.append("file", file); // Add the file to the form

    try {
      // Send a POST request to the backend with the file
      const response = await axios.post("http://127.0.0.1:8000/upload_csv", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Tells backend we're sending a file
        },
      });

      // Save the parsed appointment data that comes back from the server
      setData(response.data.appointments);
    } catch (error) {
      // If something goes wrong, log it to the console
      console.error("Something went wrong uploading the file:", error);
    }
  };

  // The return statement defines what we see on the web page (the UI)
  return (
    <div className="max-w-xl mx-auto p-4">
      {/* Main heading */}
      <h2 className="text-xl font-semibold mb-2">Upload Appointments CSV</h2>

      {/* File upload form */}
      <form onSubmit={handleSubmit}>
        {/* File input: accepts only .csv files */}
        <input type="file" accept=".csv" onChange={handleFileChange} className="mb-4" />

        {/* Submit button */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Upload
        </button>
      </form>

      {/* If we have data from the server, show it in a preview table */}
      {data.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold">Preview of Appointments:</h3>
          <table className="border border-collapse w-full text-sm mt-2">
            <thead>
              <tr>
                {/* Create a column for each CSV header */}
                {Object.keys(data[0]).map((key) => (
                  <th key={key} className="border px-2 py-1 bg-gray-100">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Create a row for each appointment */}
              {data.map((row, idx) => (
                <tr key={idx}>
                  {Object.values(row).map((value, i) => (
                    <td key={i} className="border px-2 py-1">{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Make this component available to other files like App.js
export default CSVUploader;