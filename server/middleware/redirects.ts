import { Request, Response, NextFunction } from 'express';

/**
 * URL Redirect & Gone Middleware
 * Handles 301 permanent redirects and 410 Gone responses for legacy URLs
 */

// Map of old URLs to new URLs (301 redirects)
const redirectMap: Record<string, string> = {
  // Legacy news URLs
  '/visium-news/2020/5/13/visium-technologies-obtains-exlusive-license-rights-to-its-cybersecurity-technology': '/company/news',
  
  // Old technology solutions page
  '/technology-solutions/': '/platform',
  
  // Old contact page
  '/contact-us/': '/company/contact',
  
  // Legacy date-based URLs
  '/20230912': '/blog',
};

// Paths that should return 410 Gone (deleted content)
const gonePatterns = [
  /^\/role\/.+/, // All /role/* paths (internal role-based paths)
  /^\/s\/CyGraph-Structures\.docx/, // Document downloads
  /^\/CyGraph-Structures\.docx/,
];

/**
 * Redirect middleware - handles 301 and 410 responses
 */
export function redirectMiddleware(req: Request, res: Response, next: NextFunction) {
  const path = req.path;
  
  // Check for 410 Gone patterns
  for (const pattern of gonePatterns) {
    if (pattern.test(path)) {
      return res.status(410).json({
        error: 'Gone',
        message: 'This resource has been permanently deleted and is no longer available.',
        status: 410
      });
    }
  }
  
  // Check for 301 redirects
  if (redirectMap[path]) {
    return res.redirect(301, redirectMap[path]);
  }
  
  // Handle subdomain redirects (tyofbadmin.visiumtechnologies.com -> main domain)
  const host = req.get('host') || '';
  if (host.includes('tyofbadmin.')) {
    return res.redirect(301, `https://www.visiumtechnologies.com/`);
  }
  
  // Continue to next middleware
  next();
}

/**
 * Export redirect configuration for documentation
 */
export const redirectConfig = {
  redirects: redirectMap,
  gonePatterns: gonePatterns.map(p => p.source),
  documentation: {
    description: 'Handles legacy URL redirects and deleted content responses',
    redirects: [
      {
        from: '/visium-news/2020/5/13/visium-technologies-obtains-exlusive-license-rights-to-its-cybersecurity-technology',
        to: '/company/news',
        status: 301,
        reason: 'Legacy news URL'
      },
      {
        from: '/technology-solutions/',
        to: '/platform',
        status: 301,
        reason: 'Old technology solutions page'
      },
      {
        from: '/contact-us/',
        to: '/company/contact',
        status: 301,
        reason: 'Old contact page'
      },
      {
        from: '/20230912',
        to: '/blog',
        status: 301,
        reason: 'Legacy date-based URL'
      }
    ],
    gone: [
      {
        pattern: '/role/*',
        status: 410,
        reason: 'Internal role-based paths - no longer available'
      },
      {
        pattern: '/s/CyGraph-Structures.docx',
        status: 410,
        reason: 'Document no longer available'
      }
    ],
    subdomainRedirects: [
      {
        from: 'tyofbadmin.visiumtechnologies.com',
        to: 'www.visiumtechnologies.com',
        status: 301,
        reason: 'Legacy admin subdomain'
      }
    ]
  }
};
