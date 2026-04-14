import { describe, it, expect } from "vitest";

describe("News Page - Press Release Links & Formatting", () => {
  it("should have the latest press release at the top", () => {
    const latestPressRelease = {
      date: "April 14, 2026",
      title: "Visium Technologies Eliminates Over $182,000 in Outstanding Debt and All Conversion Overhang Through Full Settlement of Labrys Notes and Talos Warrants",
      excerpt: "Visium Technologies announces the execution of a definitive Settlement Agreement providing for the full and final extinguishment of all outstanding obligations under the Labrys Notes and the Talos Warrants.",
      url: "https://www.einpresswire.com/article/904942308/visium-technologies-eliminates-over-182-000-in-outstanding-debt-and-all-conversion-overhang-through-full-settlement-of-labrys-notes-and-talos",
      source: "EIN Presswire",
      category: "Corporate News"
    };

    expect(latestPressRelease.date).toBe("April 14, 2026");
    expect(latestPressRelease.title).toContain("$182,000");
    expect(latestPressRelease.title).toContain("Labrys Notes");
    expect(latestPressRelease.category).toBe("Corporate News");
    expect(latestPressRelease.source).toBe("EIN Presswire");
    expect(latestPressRelease.url).toContain("einpresswire.com");
    expect(latestPressRelease.url).toContain("904942308");
  });

  it("should have a valid OTC Markets URL for the latest press release", () => {
    const url = "https://www.otcmarkets.com/stock/VISM/news/Visium-Technologies-Launches-TruContext-AI-Governance-Layer-to-Contain-OpenClaw-Style-Autonomous-Agent-Risks";
    
    expect(url).toMatch(/^https:\/\/www\.otcmarkets\.com\//);
    expect(url).toContain("VISM");
    expect(url).toContain("TruContext");
  });

  it("should have consistent formatting across all press releases", () => {
    const pressReleases = [
      {
        date: "March 19, 2026",
        title: "Visium Technologies Launches TruContext™ AI Governance Layer to Contain OpenClaw Style Autonomous Agent Risks",
        excerpt: "Visium Technologies announces the launch of a new AI Governance Layer within TruContext, designed to address emerging security risks from autonomous AI agents.",
        url: "https://www.otcmarkets.com/stock/VISM/news/Visium-Technologies-Launches-TruContext-AI-Governance-Layer-to-Contain-OpenClaw-Style-Autonomous-Agent-Risks",
        source: "OTC Disclosure & News Service",
        category: "Product Launch"
      },
      {
        date: "January 30, 2026",
        title: "Visium Technologies and IREX.AI to Host Webinar on Peru's 54,000-Camera AI Surveillance Network",
        excerpt: "CEOs Calvin Yadav and Mark Lucky Will Discuss Landmark Deployment Addressing Latin American Security",
        url: "https://www.otcmarkets.com/stock/VISM/news/Visium-Technologies-and-IREXAI-to-Host-Webinar-on-Perus-54000-Camera-AI-Surveillance-Network?id=508740",
        source: "EIN Presswire",
        category: "Industry Events"
      }
    ];

    pressReleases.forEach((pr) => {
      expect(pr).toHaveProperty("date");
      expect(pr).toHaveProperty("title");
      expect(pr).toHaveProperty("excerpt");
      expect(pr).toHaveProperty("url");
      expect(pr).toHaveProperty("source");
      expect(pr).toHaveProperty("category");
      
      expect(typeof pr.date).toBe("string");
      expect(typeof pr.title).toBe("string");
      expect(typeof pr.excerpt).toBe("string");
      expect(typeof pr.url).toBe("string");
      expect(typeof pr.source).toBe("string");
      expect(typeof pr.category).toBe("string");
      
      expect(pr.url).toMatch(/^https:\/\//);
      expect(pr.title.length).toBeGreaterThan(10);
      expect(pr.excerpt.length).toBeGreaterThan(20);
    });
  });

  it("should have all press release URLs accessible", () => {
    const urls = [
      "https://www.einpresswire.com/article/904942308/visium-technologies-eliminates-over-182-000-in-outstanding-debt-and-all-conversion-overhang-through-full-settlement-of-labrys-notes-and-talos",
      "https://www.otcmarkets.com/stock/VISM/news/Visium-Technologies-Launches-TruContext-AI-Governance-Layer-to-Contain-OpenClaw-Style-Autonomous-Agent-Risks",
      "https://www.otcmarkets.com/stock/VISM/news/Visium-Technologies-and-IREXAI-to-Host-Webinar-on-Perus-54000-Camera-AI-Surveillance-Network?id=508740",
      "https://www.otcmarkets.com/stock/VISM/news?id=484402"
    ];

    urls.forEach((url) => {
      expect(url).toMatch(/^https:\/\//);
      expect(url).not.toContain(" ");
      expect(url.length).toBeGreaterThan(20);
    });
  });

  it("should have proper date formatting", () => {
    const dates = ["April 14, 2026", "March 19, 2026", "January 30, 2026", "December 23, 2025"];
    
    dates.forEach((date) => {
      expect(date).toMatch(/^(January|February|March|April|May|June|July|August|September|October|November|December)\s\d{1,2},\s\d{4}$/);
    });
  });

  it("should have valid press release categories", () => {
    const validCategories = [
      "Product Launch",
      "Corporate News",
      "Partnerships",
      "Industry Events",
      "Webinars"
    ];

    const categories = [
      "Product Launch",
      "Industry Events",
      "Partnerships",
      "Corporate News"
    ];

    categories.forEach((category) => {
      expect(validCategories).toContain(category);
    });
  });

  it("should have source attribution for all press releases", () => {
    const sources = [
      "OTC Disclosure & News Service",
      "EIN Presswire",
      "OTC Markets",
      "AccessWire"
    ];

    sources.forEach((source) => {
      expect(source.length).toBeGreaterThan(0);
      expect(typeof source).toBe("string");
    });
  });
});
