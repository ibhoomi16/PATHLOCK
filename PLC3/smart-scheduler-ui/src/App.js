import React, { useState } from "react";
import "./App.css";

export default function SmartScheduler() {
  const [jsonInput, setJsonInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setResult(null);

    try {
      const parsed = JSON.parse(jsonInput);
      setLoading(true);

      const response = await fetch("http://localhost:5244/api/v1/projects/123/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Server Error");

      setResult(data);
    } catch (err) {
      if (err.name === "SyntaxError")
        setError("❌ Invalid JSON format. Please check your input.");
      else setError(`⚠️ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scheduler-container">
      <h1>🧠 Smart Scheduler</h1>
      <p className="subtitle">Enter your task list in JSON format to get an optimized schedule</p>

      <textarea
        placeholder='Example: [{"task":"Task 1"}, {"task":"Task 2"}]'
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={loading || !jsonInput.trim()}
        className={loading ? "loading" : ""}
      >
        {loading ? <div className="loader"></div> : "Generate Schedule"}
      </button>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result">
          <h3>✅ Recommended Order:</h3>
          {result.recommendedOrder?.length > 0 ? (
            <p className="order">
              {result.recommendedOrder.join(" ➜ ")}
            </p>
          ) : (
            <p>No valid order found.</p>
          )}
        </div>
      )}
    </div>
  );
}
