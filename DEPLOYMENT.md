# 🚀 Deployment Guide for GitHub Portfolio Analyzer

This guide will help you host your **GitHub Portfolio Analyzer** for free using standard hackathon-friendly platforms: **GitHub Pages** for the frontend and **Hugging Face Spaces** for the backend.

## Prerequisites

1.  A [GitHub](https://github.com/) account.
2.  A [Hugging Face](https://huggingface.co/) account.

---

## Step 1: Deploy Backend (Hugging Face Spaces)

We will host the `server` folder on Hugging Face Spaces using their Docker support. This provides an always-on backend.

1.  **Log in to [Hugging Face](https://huggingface.co/)**.
2.  Go to your profile -> **New Space**.
3.  Configure the Space:
    *   **Space name**: `github-analyzer-api` (or similar).
    *   **License**: Pick any or leave empty.
    *   **Select the Space SDK**: Choose **Docker** -> **Blank**.
    *   **Space hardware**: Free `CPU basic · 2vCPU · 16GB` is sufficient.
    *   **Visibility**: Public.
4.  Click **Create Space**.
5.  In the "Files and versions" tab of your newly created Space, you need to upload your backend files. 
    Alternatively, clone the Space repository locally and push your `server` code into the **root** of the Space.
    *   Ensure the `Dockerfile`, `index.js`, `package.json`, and `scoringEngine.js` are in the root of the Hugging Face Space repository.
6.  **Set Environment Variables**:
    *   Go to your Space's **Settings** -> **Variables and secrets** -> **New secret**.
    *   **Name**: `GITHUB_TOKEN`
    *   **Value**: `ghp_...` (Your GitHub Token from `.env`).
7.  Hugging Face will automatically build your Docker container. Once it's "Running", click "Embed this space" (top right button, looks like `< >`) -> "Direct URL" to get your backend URL, for example: `https://username-github-analyzer-api.hf.space`.

---

## Step 2: Push Code to GitHub

Your frontend will be deployed via GitHub Actions to GitHub Pages. First, ensure your code is pushed.

1.  Create a new repository on GitHub named exactly `Github-Portfolio-AnalyZer`. *(If using a different name, you MUST update `base` in `client/vite.config.js` to match the exact repo name)*.
2.  In your project root, run:
    ```bash
    git init
    git add .
    git commit -m "Initial commit for hackathon"
    git branch -M main
    git remote add origin https://github.com/<YOUR_USERNAME>/Github-Portfolio-AnalyZer.git
    git push -u origin main
    ```

---

## Step 3: Deploy Frontend (GitHub Pages)

The project includes a `.github/workflows/deploy.yml` file which automates deployment.

1.  On GitHub, go to your repository **Settings** -> **Pages**.
2.  Under **Build and deployment** -> **Source**, select **GitHub Actions**.
3.  We need to tell the frontend where the Hugging Face backend is hosted. 
    Go to repository **Settings** -> **Secrets and variables** -> **Actions** -> **New repository variable** (Variables, not Secrets, because it will be baked into the public frontend code).
    *   **Name**: `VITE_API_URL`
    *   **Value**: `https://username-github-analyzer-api.hf.space` (Your Hub URL from step 1).
4.  Wait for the GitHub Action to run. You can view progress in the "Actions" tab of your repository.
5.  Once finished, the Actions tab will provide the deployed URL (e.g., `https://<YOUR_USERNAME>.github.io/Github-Portfolio-AnalyZer/`).

---

## Step 4: Verify Live App

1.  Open your frontend link from GitHub Pages.
2.  Enter a GitHub profile URL to test.
3.  **Celebration!** 🎉 Your hackathon project is now live and publicly accessible.

---

## Troubleshooting

*   **Backend Error**: Check Hugging Face Space logs. Ensure `GITHUB_TOKEN` is set as a Secret, not a public variable.
*   **Frontend Error**: If the analyzer hangs or fails, check the Browser Console (F12). Ensure `VITE_API_URL` is configured accurately with the `https://...hf.space` domain without a trailing slash.
