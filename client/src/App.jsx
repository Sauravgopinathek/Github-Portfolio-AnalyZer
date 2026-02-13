import { useState } from "react";
import axios from "axios";
import "./index.css";

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeProfile = async () => {
    if (!url) {
      setError("Please enter a GitHub URL");
      return;
    }

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await axios.post(`${apiUrl}/analyze`, {
        githubUrl: url,
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || "Error analyzing profile. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return "#4caf50";
    if (score >= 5) return "#ffa726";
    return "#f44336";
  };

  return (
    <div className="container">
      <h1>GitHub Portfolio Analyzer</h1>
      <p style={{ textAlign: "center", marginBottom: "40px", color: "#8b949e" }}>
        Turn your repositories into recruiter-ready proof.
      </p>

      <div className="input-section">
        <input
          type="text"
          className="input-field"
          placeholder="https://github.com/username"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && analyzeProfile()}
        />
        <button
          onClick={analyzeProfile}
          className="analyze-btn"
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Profile"}
        </button>
      </div>

      {error && <div style={{ color: "#ff6b6b", textAlign: "center", marginBottom: "20px" }}>{error}</div>}

      {result && (
        <div className="result-box">
          {/* Header Score */}
          <div className="score-header">
            <span className="score-label">Overall Portfolio Score</span>
            <div
              className="overall-score"
              style={{
                color: result.overallScore >= 80 ? "#4caf50" : result.overallScore >= 50 ? "#ffa726" : "#f44336"
              }}
            >
              {result.overallScore}
            </div>
          </div>

          <div className="summary-text">
            <strong>Recruiter Insight:</strong> {result.summary}
          </div>

          {/* Score Grid */}
          <h3 className="section-title">Detailed Breakdown</h3>
          <div className="grid">
            {Object.entries(result.scores).map(([key, value]) => (
              <div key={key} className="score-card" style={{ borderColor: getScoreColor(value) }}>
                <h4>{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                <div className="score-value" style={{ color: getScoreColor(value) }}>
                  {value}/10
                </div>
              </div>
            ))}
          </div>

          {/* Signals */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <h3 className="section-title" style={{ color: "#7ee787" }}>Strong Signals</h3>
              {result.strongSignals.length > 0 ? (
                result.strongSignals.map((signal, index) => (
                  <div key={index} className="signal-item signal-strong">
                    ✓ {signal}
                  </div>
                ))
              ) : (
                <p style={{ color: "#8b949e" }}>No strong signals detected yet.</p>
              )}
            </div>

            <div>
              <h3 className="section-title" style={{ color: "#ffa198" }}>Red Flags</h3>
              {result.redFlags.length > 0 ? (
                result.redFlags.map((flag, index) => (
                  <div key={index} className="signal-item signal-redflag">
                    ⚠ {flag}
                  </div>
                ))
              ) : (
                <p style={{ color: "#8b949e" }}>No major red flags found!</p>
              )}
            </div>
          </div>

          {/* Suggestions */}
          <h3 className="section-title">Actionable Suggestions</h3>
          {result.suggestions.map((suggestion, index) => (
            <div key={index} className="suggestion-item">
              💡 {suggestion}
            </div>
          ))}

          {/* Resume Bullets */}
          {result.resumeBullets && (
            <>
              <h3 className="section-title" style={{ marginTop: "40px", color: "#58a6ff" }}>
                ✨ Recruiter-Ready Resume Bullets
              </h3>
              <p style={{ color: "#8b949e", marginBottom: "15px" }}>
                Copy these directly to your resume or LinkedIn to showcase your GitHub impact.
              </p>
              <div style={{ background: "#161b22", padding: "20px", borderRadius: "8px", border: "1px solid #30363d" }}>
                {result.resumeBullets.map((bullet, index) => (
                  <div
                    key={index}
                    style={{ marginBottom: "12px", display: "flex", gap: "10px", alignItems: "start", cursor: "pointer" }}
                    onClick={() => {
                      navigator.clipboard.writeText(bullet);
                      alert("Copied to clipboard!");
                    }}
                    title="Click to copy"
                  >
                    <span style={{ color: "#58a6ff", marginTop: "4px" }}>•</span>
                    <span className="bullet-text">{bullet}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Repo Audit */}
          {result.auditLog && result.auditLog.length > 0 && (
            <>
              <h3 className="section-title" style={{ marginTop: "40px", color: "#ffa726" }}>
                🛠 Repository Health Check
              </h3>
              <p style={{ color: "#8b949e", marginBottom: "15px" }}>
                Fix these specific repositories to immediately boost your score and recruiter appeal.
              </p>
              <div className="grid">
                {result.auditLog.map((repo, index) => (
                  <div key={index} className="score-card" style={{ textAlign: "left", borderColor: "#30363d" }}>
                    <a href={repo.url} target="_blank" rel="noopener noreferrer" style={{ color: "#58a6ff", fontWeight: "bold", textDecoration: "none", fontSize: "1.1rem" }}>
                      {repo.name} ↗
                    </a>
                    <div style={{ marginTop: "10px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {repo.issues.map((issue, i) => (
                        <span key={i} style={{
                          backgroundColor: "rgba(218, 54, 51, 0.15)",
                          color: "#ffa198",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "0.85rem",
                          border: "1px solid rgba(218, 54, 51, 0.4)"
                        }}>
                          {issue}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      )}
    </div>
  );
}

export default App;
