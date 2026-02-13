# GitHub Portfolio Analyzer & Enhancer 🚀

![Status](https://img.shields.io/badge/Status-Prototype-green) ![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20Express-blue)

A powerful tool designed to help students and early-career developers turn their GitHub repositories into recruiter-ready proof. Analyzing documentation, code quality, and consistency, this tool provides an objective score and actionable feedback.

## 🎥 Demo Video

[INSERT YOUR DEMO VIDEO LINK HERE]
*(Required for Hackathon Submission: Include a screen-recording video of your live, working project)*

## ✨ Features

- **Objective Scoring System**: Analyzes documentation, activity, impact, organization, technical depth, and language diversity.
- **Recruiter-Centric Feedback**: Highlights "Strong Signals" and "Red Flags" that recruiters notice first.
- **Actionable Suggestions**: Provides specific steps to improve your profile (e.g., "Add a detailed README", "Pin your best repos").
- **Clean, Modern UI**: Dark-themed, responsive interface focused on clarity and impact.

## 🛠 Tech Stack

- **Frontend**: React (Vite), CSS3 (Custom Design System, Animations)
- **Backend**: Node.js, Express
- **API**: GitHub REST API
- **Tools**: Axios, CORS

## 🚀 Getting Started

### Prerequisites
- Node.js installed

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Github_Analyzer
   ```

2. **Setup Server**
   ```bash
   cd server
   npm install
   # Start the backend server on port 5000
   node index.js
   ```

3. **Setup Client** (Open a new terminal)
   ```bash
   cd client
   npm install
   # Start the frontend development server
   npm run dev
   ```

4. **Open Application**
   Visit `http://localhost:5173` (or the URL shown in your terminal).

## 📊 Scoring Dimensions

1. **Documentation Quality**: Checks for descriptions, homepages, and wiki references.
2. **Activity Consistency**: Analyzes commit frequency over the last 90 days.
3. **Project Impact**: Evaluates stars, forks, and community engagement.
4. **Organization**: Assessment of forked vs. original repos and topic usage.
5. **Technical Depth**: Estimates complexity based on repository size and structure.
6. **Language Diversity**: Checks for versatility across different technologies.

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).

---
*Built for the UnsaidTalks Hackathon 2026*
