import { useState } from "react";
import "./App.css";
import logo from "./assets/logo.png";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!file) {
      alert("Please select an image first.");
      return;
    }

    console.log("Uploading file:", file);
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Server error:", response.status, text);
        alert(`Server error ${response.status}: ${text}`);
        return;
      }

      const data = await response.json();
      console.log("Server response:", data);
      setResult(data);
    } catch (error) {
      console.error("Fetch failed:", error);
      alert("Backend connection failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <section className="hero">
        {/* logo */}
        <img src={logo} alt="Logo" className="logo" />
        <h1>Deepfake Detector AI</h1>
        <p>
          Upload an image and instantly detect whether it is real or AI-generated.
        </p>
      </section>

      <section className="upload-section">
        <div className="card">
          <div
            className="drop-zone"
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();

              const files = e.dataTransfer.files;
              if (files && files.length > 0) {
                setFile(files[0]);
              }
            }}
            onClick={() => document.getElementById("fileInput").click()}
          >
            <p>Drag & drop image here or click to select</p>

            <input
              id="fileInput"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ display: "none" }}
            />
          </div>

          <button onClick={handleAnalyze}>
            {loading ? "Analyzing..." : "Analyze Image"}
          </button>

          {/* ✅ Image Preview */}
          {file && (
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="preview"
            />
          )}

          {result && (
            <div className="result">
              <h3>Scan Result</h3>
              <p>
                <strong>File:</strong> {result.filename}
              </p>

              <p>
                <strong>Noise Level:</strong> {result.analysis?.noise_level}
              </p>

              <p>
                <strong>Prediction:</strong> {result.analysis?.prediction}
              </p>

              <p>
                <strong>Confidence:</strong> {result.analysis?.confidence}
              </p>

              {/* Optional visual indicator */}
              <p>
                <strong>Status:</strong>{" "}
                {result.analysis?.prediction === "Likely Deepfake"
                  ? "❌"
                  : result.analysis?.prediction === "Possibly Manipulated"
                  ? "⚠️"
                  : "✅"}
              </p>
            </div>
          )}

          {/* add a visible selected filename under your drop-zone if you want: */}
          {file && <p className="selected">Selected: {file.name}</p>}
        </div>
      </section>
    </div>
  );
}

export default App;