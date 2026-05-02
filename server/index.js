const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const {
  calculateDocumentationScore,
  calculateActivityScore,
  calculateImpactScore,
  calculateOrganizationScore,
  calculateTechnicalDepthScore,
  calculateLanguageScore,
  getOverallScore,
  generateSignals,
  generateSuggestions,
  generateSummary,
  generateResumeBullets,
  auditRepositories
} = require("./scoringEngine");

const app = express();
app.use(cors()); // Allow all origins for the hackathon
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 7860;

function extractUsername(url) {
  const parts = url.split("github.com/");
  return parts[1]?.split("/")[0];
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/analyze", async (req, res) => {
  try {
    const { githubUrl } = req.body;

    if (!githubUrl)
      return res.status(400).json({ error: "GitHub URL required" });

    const username = extractUsername(githubUrl);

    if (!username)
      return res.status(400).json({ error: "Invalid GitHub URL" });

    const headers = process.env.GITHUB_TOKEN
      ? { Authorization: `token ${process.env.GITHUB_TOKEN}` }
      : {};

    const reposResponse = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      { headers }
    );

    const repos = reposResponse.data;

    const scores = {
      documentation: calculateDocumentationScore(repos),
      activity: calculateActivityScore(repos),
      impact: calculateImpactScore(repos),
      organization: calculateOrganizationScore(repos),
      technicalDepth: calculateTechnicalDepthScore(repos),
      language: calculateLanguageScore(repos)
    };

    const overallScore = getOverallScore(scores);

    const signals = generateSignals(repos, scores);
    const suggestions = generateSuggestions(scores);
    const summary = generateSummary(overallScore);
    const resumeBullets = generateResumeBullets(repos, scores);
    const auditLog = auditRepositories(repos);

    res.json({
      overallScore,
      summary,
      scores,
      strongSignals: signals.strongSignals,
      redFlags: signals.redFlags,
      suggestions,
      resumeBullets,
      auditLog
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch GitHub data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
