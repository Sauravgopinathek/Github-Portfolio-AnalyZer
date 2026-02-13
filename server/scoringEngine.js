// ===== Documentation Score =====
function calculateDocumentationScore(repos) {
  const repoCount = repos.length;
  if (repoCount === 0) return 0;

  // Check for description, homepage (demo link), and wiki/pages
  const describedRepos = repos.filter(repo => repo.description).length;
  const homepageRepos = repos.filter(repo => repo.homepage).length;
  const wikiRepos = repos.filter(repo => repo.has_wiki || repo.has_pages).length;

  // Weighted score: Description (40%), Homepage/Demo (30%), Wiki/Pages (30%)
  const descriptionScore = (describedRepos / repoCount) * 4;
  const homepageScore = (homepageRepos / repoCount) * 3;
  const wikiScore = (wikiRepos / repoCount) * 3;

  let total = descriptionScore + homepageScore + wikiScore;

  // Scale to 0-10, slightly boosting ensuring good behavior gets high score
  return Math.min(Math.round(total * 1.5), 10);
}

// ===== Activity Score =====
function calculateActivityScore(repos) {
  const now = new Date();
  const recentRepos = repos.filter(repo => {
    const updated = new Date(repo.pushed_at);
    const diffDays = (now - updated) / (1000 * 60 * 60 * 24);
    return diffDays < 90; // Active in last 3 months
  });

  if (recentRepos.length >= 5) return 10;
  if (recentRepos.length >= 3) return 8;
  if (recentRepos.length >= 1) return 5;
  return 2;
}

// ===== Impact Score =====
function calculateImpactScore(repos) {
  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);

  // Bonus specifically for having ANY stars (indicates external eyes)
  const reposWithStars = repos.filter(r => r.stargazers_count > 0).length;

  let score = 0;
  if (totalStars > 50) score = 10;
  else if (totalStars > 20) score = 9;
  else if (totalStars > 10) score = 8;
  else if (totalStars > 5) score = 7;
  else if (totalStars > 0) score = 5;
  else score = 2;

  if (totalForks > 5) score += 1;
  if (reposWithStars > 2) score += 1;

  return Math.min(score, 10);
}

// ===== Organization Score =====
function calculateOrganizationScore(repos) {
  const forked = repos.filter(r => r.fork).length;
  const original = repos.length - forked;

  // Recruiters prefer original work, but some forks are okay (contributions)
  // Penalize if > 70% are forks
  if (repos.length > 0 && (forked / repos.length) > 0.7) return 4;

  // Check if they use topics
  const reposWithTopics = repos.filter(r => r.topics && r.topics.length > 0).length;

  let score = 6;
  if (original > 2) score += 2;
  if (reposWithTopics > 2) score += 2;

  return Math.min(score, 10);
}

// ===== Technical Depth Score =====
function calculateTechnicalDepthScore(repos) {
  // Rough proxy: Size (kB) implies code volume. > 1MB is decent.
  // Ideally we'd look at language distribution and file counts.
  const complexRepos = repos.filter(r => r.size > 1000).length; // > 1MB

  if (complexRepos >= 5) return 10;
  if (complexRepos >= 3) return 8;
  if (complexRepos >= 1) return 6;
  return 3;
}

// ===== Language Diversity Score =====
function calculateLanguageScore(repos) {
  const languages = new Set();
  repos.forEach(repo => {
    if (repo.language) languages.add(repo.language);
  });

  if (languages.size >= 5) return 10;
  if (languages.size >= 3) return 8;
  if (languages.size >= 2) return 6;
  return 3;
}

// ===== Overall Score =====
function getOverallScore(scores) {
  const weighted =
    scores.documentation * 0.25 + // Increased weight
    scores.activity * 0.20 +
    scores.impact * 0.15 +
    scores.organization * 0.10 +
    scores.technicalDepth * 0.20 +
    scores.language * 0.10;

  return Math.round(weighted * 10);
}

// ===== Signals =====
function generateSignals(repos, scores) {
  const strongSignals = [];
  const redFlags = [];

  if (scores.documentation >= 8)
    strongSignals.push("Excellent documentation habits (Descriptions, Homepages, Wikis).");
  else if (scores.documentation < 5)
    redFlags.push("Many repositories lack descriptions or live demo links.");

  if (scores.activity >= 8)
    strongSignals.push("Consistent coding activity in the last 90 days.");
  else if (scores.activity < 5)
    redFlags.push("Low activity recently. Recruiters look for consistency.");

  if (scores.impact >= 7)
    strongSignals.push("Projects have traction (Stars/Forks). Good community engagement.");
  else
    redFlags.push("Projects lack visibility (Stars/Forks).");

  if (scores.technicalDepth >= 7)
    strongSignals.push("Portfolio contains substantial, complex projects.");

  if (scores.language >= 8)
    strongSignals.push("Polyglot programmer: Demonstrated proficiency in multiple languages.");

  // Check for "ghost town"
  const archived = repos.filter(r => r.archived).length;
  if (archived > repos.length / 2)
    redFlags.push("High number of archived repositories.");

  return { strongSignals, redFlags };
}

// ===== Actionable Suggestions =====
function generateSuggestions(scores) {
  const suggestions = [];

  if (scores.documentation < 7) {
    suggestions.push("Add a detailed README to your pinned repositories. Explain 'Why' you built it, not just 'How' to run it.");
    suggestions.push("Ensure every public repository has a clear description and a 'Homepage' URL (even if it's just the repo link).");
  }

  if (scores.activity < 7)
    suggestions.push("Commit consistently rather than in bursts. Aim for at least one meaningful commit per week.");

  if (scores.impact < 6)
    suggestions.push("Share your projects on LinkedIn, Reddit, or Twitter/X to gain stars and feedback.");

  if (scores.technicalDepth < 7)
    suggestions.push("Build one 'Hero Project': A full-stack application or complex library that solves a real problem.");

  if (scores.organization < 7)
    suggestions.push("Add 'Topics' (tags) to your repositories (e.g., 'react', 'machine-learning') to improve discoverability.");

  // Fillers if doing well
  if (suggestions.length < 3) {
    suggestions.push("Consider contributing to Open Source projects to boost your Impact score.");
    suggestions.push("Create a personal portfolio website and link it in your GitHub bio.");
    suggestions.push("Pin your best 4-6 repositories to your profile for immediate visibility.");
  }

  return suggestions.slice(0, 5); // Return top 5
}

// ===== Recruiter Summary =====
function generateSummary(overallScore) {
  if (overallScore >= 85)
    return "Top Tier! Your profile screams 'Hire Me'. It shows technical depth, consistency, and clear communication.";
  if (overallScore >= 70)
    return "Strong Profile. You're definitely on the right track, but a few polish items (like better docs or more consistent structure) could make you elite.";
  if (overallScore >= 50)
    return "Good Start. You have the code, but you need to sell it better. Focus on Presentation (READMEs) and Cleaning up your repo list.";
  return "Needs Work. Recruiters might struggle to see your skills. Focus on documenting 1-2 key projects thoroughly rather than having many empty ones.";
}

// ===== Resume Bullets =====
function generateResumeBullets(repos, scores) {
  const bullets = [];
  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const languages = new Set(repos.map(r => r.language).filter(Boolean));
  const topLanguage = Array.from(languages)[0] || "Code";

  // Bullet 1: Technical Breadth
  if (scores.language >= 7) {
    bullets.push(`Demonstrated proficiency in ${languages.size}+ languages including ${Array.from(languages).slice(0, 3).join(", ")}, across ${repos.length} public repositories.`);
  } else {
    bullets.push(`Maintained an active development portfolio with ${repos.length} projects focused on ${topLanguage} and web technologies.`);
  }

  // Bullet 2: Impact & Collaboration
  if (totalStars > 5) {
    bullets.push(`Built open-source solutions garnering ${totalStars}+ stars and community engagement on GitHub.`);
  } else if (scores.activity >= 7) {
    bullets.push(`Consistently contributed code with a strong commit history over the last quarter, demonstrating engineering discipline.`);
  } else {
    bullets.push("Developed and documented full-stack applications solving real-world problems with a focus on code quality.");
  }

  // Bullet 3: Complexity/Depth
  if (scores.technicalDepth >= 7) {
    bullets.push("Architected complex, scalable applications utilizing modern design patterns and comprehensive documentation.");
  } else {
    bullets.push("Implemented modular and reusable code structures in personal projects to ensure maintainability and scalability.");
  }

  return bullets;
}

// ===== Repository Audit =====
function auditRepositories(repos) {
  const auditLog = [];

  repos.forEach(repo => {
    const issues = [];
    if (!repo.description) issues.push("Missing Description");
    if (!repo.homepage) issues.push("No Live/Demo Link");
    if (!repo.license) issues.push("No License");
    if (!repo.topics || repo.topics.length === 0) issues.push("No Topics");

    if (issues.length > 0 && !repo.archived && !repo.fork) {
      auditLog.push({
        name: repo.name,
        url: repo.html_url,
        issues: issues
      });
    }
  });

  // Return top 5 most critical repos to fix
  return auditLog.slice(0, 5);
}

module.exports = {
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
};
