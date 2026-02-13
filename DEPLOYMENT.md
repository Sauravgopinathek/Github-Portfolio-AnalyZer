
# 🚀 Deployment Guide for GitHub Portfolio Analyzer

This guide will help you host your **GitHub Portfolio Analyzer** for free using standard hackathon-friendly platforms.

## Prerequisites

1.  A [GitHub](https://github.com/) account.
2.  A [Render](https://render.com/) account (for the backend).
3.  A [Vercel](https://vercel.com/) account (for the frontend).

---

## Step 1: Push Code to GitHub

First, you need to push your local changes to a new GitHub repository.

1.  Create a new repository on GitHub (e.g., `github-analyzer`).
2.  In your project root (where `client` and `server` folders reside), run:
    ```bash
    git init
    git add .
    git commit -m "Initial commit for hackathon"
    git branch -M main
    git remote add origin https://github.com/<YOUR_USERNAME>/github-analyzer.git
    git push -u origin main
    ```

---

## Step 2: Deploy Backend (Render)

We will host the `server` folder on Render because it supports Node.js services easily.

1.  **Log in to [Render](https://dashboard.render.com/)**.
2.  Click **"New +"** -> **"Web Service"**.
3.  Connect your GitHub repository (`github-analyzer`).
4.  Configure the service:
    *   **Name**: `github-analyzer-api` (or similar)
    *   **Root Directory**: `server` (IMPORTANT!)
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
    *   **Region**: Pick the closest to you.
5.  **Environment Variables**:
    Scroll down to "Advanced" -> "Add Environment Variable":
    *   `GITHUB_TOKEN`: `Start with ghp_...` (Copy from your local `.env`)
    *   `PORT`: `10000` (Render sets this automatically, but good to know)
6.  Click **"Create Web Service"**.

Wait for the deployment to finish. Once live, Render will give you a URL like:
`https://github-analyzer-api.onrender.com`
**Copy this URL.** You will need it for the frontend.

---

## Step 3: Deploy Frontend (Vercel)

We will host the `client` folder on Vercel because it's optimized for React/Vite.

1.  **Log in to [Vercel](https://vercel.com/dashboard)**.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your `github-analyzer` repository.
4.  Configure the project:
    *   **Framework Preset**: `Vite` (Should detect automatically).
    *   **Root Directory**: Click "Edit" and select `client`.
5.  **Environment Variables**:
    Expand "Environment Variables" section:
    *   **Key**: `VITE_API_URL`
    *   **Value**: `https://github-analyzer-api.onrender.com` (Paste your Render Backend URL here WITHOUT the trailing slash).
6.  Click **"Deploy"**.

---

## Step 4: Verify Live App

1.  Once Vercel finishes, click the domain link (e.g., `https://github-analyzer.vercel.app`).
2.  Enter a GitHub profile URL to test.
3.  **Celebration!** 🎉 Your hackathon project is now live and publicly accessible.

---

## Troubleshooting

*   **Backend Error**: Check Render logs. If it says "Rate Limit Exceeded", ensure your `GITHUB_TOKEN` is valid and added correctly as an Environment Variable.
*   **Frontend Error**: If the analyzer hangs or fails, check the Browser Console (F12). Ensure `VITE_API_URL` is set correctly in Vercel without a trailing slash.
