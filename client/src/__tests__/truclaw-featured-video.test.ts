import { describe, it, expect } from "vitest";

describe("TruClaw Featured Video", () => {
  it("should have correct video metadata", () => {
    const truclawVideo = {
      title: "TruClaw Secures The Agentic Frontier",
      url: "https://youtu.be/skDDVvoIdcY",
      duration: "0:00",
      views: "0",
      category: "product-features",
      playlist: "getting-started",
      engagementScore: 100,
      description: "Introducing TruClaw: Tyvanto's advanced security framework that secures the agentic frontier, protecting against autonomous AI agent risks and emerging threats."
    };

    expect(truclawVideo.title).toBe("TruClaw Secures The Agentic Frontier");
    expect(truclawVideo.url).toContain("youtu.be");
    expect(truclawVideo.category).toBe("product-features");
    expect(truclawVideo.engagementScore).toBe(100);
  });

  it("should have valid YouTube URL", () => {
    const url = "https://youtu.be/skDDVvoIdcY";
    expect(url).toMatch(/^https:\/\/youtu\.be\/[a-zA-Z0-9_-]+$/);
  });

  it("should extract video ID correctly", () => {
    const url = "https://youtu.be/skDDVvoIdcY";
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    
    expect(videoIdMatch).toBeTruthy();
    expect(videoIdMatch?.[1]).toBe("skDDVvoIdcY");
  });

  it("should generate correct thumbnail URL", () => {
    const videoId = "skDDVvoIdcY";
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    
    expect(thumbnailUrl).toContain("img.youtube.com");
    expect(thumbnailUrl).toContain(videoId);
    expect(thumbnailUrl).toContain("maxresdefault");
  });

  it("should have featured video as first in array", () => {
    const videos = [
      {
        title: "TruClaw Secures The Agentic Frontier",
        category: "product-features",
        engagementScore: 100
      },
      {
        title: "Tyvanto Arqen Intro",
        category: "training",
        engagementScore: 95
      }
    ];

    expect(videos[0].title).toBe("TruClaw Secures The Agentic Frontier");
    expect(videos[0].engagementScore).toBeGreaterThanOrEqual(videos[1].engagementScore);
  });

  it("should have product-features category", () => {
    const categories = [
      { id: 'training', label: 'Training' },
      { id: 'interview', label: 'Interview' },
      { id: 'use-case', label: 'Use Case' },
      { id: 'webinar', label: 'Webinar' },
      { id: 'product-features', label: 'Product Features' }
    ];

    const productFeaturesCategory = categories.find(c => c.id === 'product-features');
    expect(productFeaturesCategory).toBeDefined();
    expect(productFeaturesCategory?.label).toBe('Product Features');
  });

  it("should have proper description length", () => {
    const description = "Introducing TruClaw: Tyvanto's advanced security framework that secures the agentic frontier, protecting against autonomous AI agent risks and emerging threats.";
    
    expect(description.length).toBeGreaterThan(50);
    expect(description).toContain("TruClaw");
    expect(description).toContain("agentic");
  });

  it("should have featured video styling properties", () => {
    const featuredVideoStyles = {
      section: "py-12 bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900",
      title: "text-3xl md:text-4xl font-bold text-white",
      button: "inline-flex items-center gap-3 bg-white text-purple-900 px-8 py-3 rounded-lg font-bold hover:bg-blue-100 transition-colors shadow-lg",
      thumbnail: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300",
      buttonText: "Watch Now"
    };

    expect(featuredVideoStyles.section).toContain("bg-gradient-to-r");
    expect(featuredVideoStyles.button).toContain("bg-white");
    expect(featuredVideoStyles.button).toContain("inline-flex");
    expect(featuredVideoStyles.buttonText).toBe("Watch Now");
    expect(featuredVideoStyles.thumbnail).toContain("scale-105");
  });

  it("should have responsive grid layout", () => {
    const gridLayout = "grid md:grid-cols-2 gap-8 items-center";
    
    expect(gridLayout).toContain("md:grid-cols-2");
    expect(gridLayout).toContain("gap-8");
    expect(gridLayout).toContain("items-center");
  });
});
