import './App.css';
import React from "react";
import CSVUploader from "./CSVUploader"; // Import the CSVUploader component


function App() {
  return (
    <div className="App">
       <h1 className="text-center text-2xl font-bold mt-4">HeadsUp Admin Portal</h1>
       <CSVUploader /> {/* Show the upload UI */}
    </div>
  );
}

export default App;
