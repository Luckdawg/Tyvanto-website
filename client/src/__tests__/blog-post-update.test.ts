import { describe, it, expect } from 'vitest';
import { blogPosts } from '@/data/blogPosts';

describe('Blog Post Update - Age of Agentic AI', () => {
  it('should have updated blog post with new title', () => {
    const post = blogPosts.find(p => p.id === 'age-of-agentic-ai-arrived');
    expect(post).toBeDefined();
    expect(post?.title).toContain('Autonomous Agentic AI');
    expect(post?.title).toContain('TruClaw');
  });

  it('should have updated excerpt with new content', () => {
    const post = blogPosts.find(p => p.id === 'age-of-agentic-ai-arrived');
    expect(post?.excerpt).toContain('Autonomous Agentic AI');
    expect(post?.excerpt).toContain('TruClaw™');
    expect(post?.excerpt).toContain('governance and control layer');
  });

  it('should have updated PDF URL to new revised version', () => {
    const post = blogPosts.find(p => p.id === 'age-of-agentic-ai-arrived');
    expect(post?.pdfUrl).toContain('The_Age_of_Agentic_AI_Has_Arrived_REVISED');
    expect(post?.pdfUrl).toContain('cloudfront.net');
    expect(post?.pdfUrl).toContain('.docx');
  });

  it('should maintain blog post metadata', () => {
    const post = blogPosts.find(p => p.id === 'age-of-agentic-ai-arrived');
    expect(post?.id).toBe('age-of-agentic-ai-arrived');
    expect(post?.date).toBe('February 2026');
    expect(post?.category).toBe('CEO Corner');
  });

  it('should have valid PDF URL format', () => {
    const post = blogPosts.find(p => p.id === 'age-of-agentic-ai-arrived');
    expect(post?.pdfUrl).toMatch(/^https:\/\//);
    expect(post?.pdfUrl).toMatch(/\.docx$/);
  });

  it('should have all required blog post fields', () => {
    const post = blogPosts.find(p => p.id === 'age-of-agentic-ai-arrived');
    expect(post?.id).toBeDefined();
    expect(post?.title).toBeDefined();
    expect(post?.date).toBeDefined();
    expect(post?.category).toBeDefined();
    expect(post?.excerpt).toBeDefined();
    expect(post?.image).toBeDefined();
    expect(post?.pdfUrl).toBeDefined();
  });
});
