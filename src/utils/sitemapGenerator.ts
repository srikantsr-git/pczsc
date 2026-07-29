import { SEOStore, PageSEOConfig } from '../types/seo';

const defaultFavicon = {
  faviconUrl: '/favicon.ico',
  favicon32Url: '/favicon-32x32.png',
  favicon16Url: '/favicon-16x16.png',
  appleTouchIconUrl: '/apple-touch-icon.png',
  manifestUrl: '/site.webmanifest'
};

export const DEFAULT_PAGE_SEO: Record<string, PageSEOConfig> = {
  home: {
    pageKey: 'home',
    pageName: 'Home',
    pagePath: '/en/home',
    basic: {
      metaTitle: 'PCZSC - Pune City Zonal Sports Committee | SPPU Official Sports Body',
      metaDescription: 'Official website of Pune City Zonal Sports Committee (PCZSC) under Savitribai Phule Pune University. Access sports calendars, intercollegiate tournament draws, circulars, live streams, and results.',
      metaKeywords: 'PCZSC, Pune City Zonal Sports Committee, SPPU Sports, Pune University Sports, Intercollegiate Tournaments, Sports Calendar, Pune College Sports',
      canonicalUrl: 'https://pczsc.in/en/home'
    },
    robots: {
      index: true,
      follow: true,
      noArchive: false,
      noSnippet: false
    },
    og: {
      ogTitle: 'Pune City Zonal Sports Committee (PCZSC) - Official Portal',
      ogDescription: 'Empowering student-athletes & organizing intercollegiate championships across Pune colleges under SPPU.',
      ogImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
      ogUrl: 'https://pczsc.in/en/home',
      ogType: 'website'
    },
    twitter: {
      cardType: 'summary_large_image',
      twitterTitle: 'PCZSC - Pune City Zonal Sports Committee',
      twitterDescription: 'Official collegiate sports body under Savitribai Phule Pune University (SPPU).',
      twitterImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80'
    },
    sitemap: {
      includeInSitemap: true,
      priority: 1.0,
      changeFreq: 'daily'
    },
    favicon: { ...defaultFavicon },
    additional: {
      author: 'Pune City Zonal Sports Committee Secretariat',
      language: 'en',
      themeColor: '#d97706',
      customHeadTags: '<meta name="geo.region" content="IN-MH" />\n<meta name="geo.placename" content="Pune" />'
    }
  },
  about: {
    pageKey: 'about',
    pageName: 'About Us',
    pagePath: '/en/about-us',
    basic: {
      metaTitle: 'About PCZSC | Governance, History & Physical Education Directors',
      metaDescription: 'Learn about Pune City Zonal Sports Committee history, President address, executive committee members, and Director of Physical Education directory across Pune colleges.',
      metaKeywords: 'About PCZSC, PCZSC Executive Committee, Physical Education Directors Pune, SPPU Sports Governance',
      canonicalUrl: 'https://pczsc.in/en/about-us'
    },
    robots: {
      index: true,
      follow: true,
      noArchive: false,
      noSnippet: false
    },
    og: {
      ogTitle: 'About Pune City Zonal Sports Committee',
      ogDescription: 'Authorized governing sports body under Savitribai Phule Pune University (SPPU).',
      ogImage: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=1200&q=80',
      ogUrl: 'https://pczsc.in/en/about-us',
      ogType: 'website'
    },
    twitter: {
      cardType: 'summary_large_image',
      twitterTitle: 'About PCZSC - SPPU Sports Governance',
      twitterDescription: 'Discover PCZSC history, core values, and physical education directors list.',
      twitterImage: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=1200&q=80'
    },
    sitemap: {
      includeInSitemap: true,
      priority: 0.9,
      changeFreq: 'weekly'
    },
    favicon: { ...defaultFavicon },
    additional: {
      author: 'PCZSC Committee',
      language: 'en',
      themeColor: '#d97706',
      customHeadTags: ''
    }
  },
  documents: {
    pageKey: 'documents',
    pageName: 'Downloads & Circulars',
    pagePath: '/en/documents',
    basic: {
      metaTitle: 'Official Downloads, Circulars & Competition Results | PCZSC',
      metaDescription: 'Download official PCZSC sports calendars, intercollegiate tournament draws, rules & regulations, circulars, souvenirs, and annual sports reports.',
      metaKeywords: 'PCZSC Downloads, Sports Circulars Pune, SPPU Sports Calendar, Intercollegiate Draws, Sports Results',
      canonicalUrl: 'https://pczsc.in/en/documents'
    },
    robots: {
      index: true,
      follow: true,
      noArchive: false,
      noSnippet: false
    },
    og: {
      ogTitle: 'PCZSC Document & Circular Center',
      ogDescription: 'Access intercollegiate sports calendars, tournament draws, souvenirs, and official circulars.',
      ogImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
      ogUrl: 'https://pczsc.in/en/documents',
      ogType: 'website'
    },
    twitter: {
      cardType: 'summary_large_image',
      twitterTitle: 'PCZSC Circulars & Tournament Downloads',
      twitterDescription: 'Download official schedules, draws, rules, and circulars for Pune college sports.',
      twitterImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80'
    },
    sitemap: {
      includeInSitemap: true,
      priority: 0.8,
      changeFreq: 'daily'
    },
    favicon: { ...defaultFavicon },
    additional: {
      author: 'PCZSC Document Repository',
      language: 'en',
      themeColor: '#d97706',
      customHeadTags: ''
    }
  },
  gallery: {
    pageKey: 'gallery',
    pageName: 'Photo & Video Gallery',
    pagePath: '/en/gallery',
    basic: {
      metaTitle: 'Photo & Video Gallery | PCZSC Sports Highlights',
      metaDescription: 'Explore high-definition action photographs and video highlights from Pune intercollegiate championships, coaching camps, and award distribution ceremonies.',
      metaKeywords: 'PCZSC Gallery, Pune College Sports Photos, Intercollegiate Tournament Video, Live Streaming Sports',
      canonicalUrl: 'https://pczsc.in/en/gallery'
    },
    robots: {
      index: true,
      follow: true,
      noArchive: false,
      noSnippet: false
    },
    og: {
      ogTitle: 'PCZSC Media Center & Action Photo Gallery',
      ogDescription: 'Watch collegiate sports action photos and streaming highlights from Pune tournaments.',
      ogImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
      ogUrl: 'https://pczsc.in/en/gallery',
      ogType: 'website'
    },
    twitter: {
      cardType: 'summary_large_image',
      twitterTitle: 'PCZSC Media Center & Action Gallery',
      twitterDescription: 'View photos and video coverage from Pune intercollegiate sports events.',
      twitterImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80'
    },
    sitemap: {
      includeInSitemap: true,
      priority: 0.8,
      changeFreq: 'weekly'
    },
    favicon: { ...defaultFavicon },
    additional: {
      author: 'PCZSC Media Team',
      language: 'en',
      themeColor: '#d97706',
      customHeadTags: ''
    }
  },
  contact: {
    pageKey: 'contact',
    pageName: 'Contact Us',
    pagePath: '/en/contact-us',
    basic: {
      metaTitle: 'Contact PCZSC Secretariat | Office Address & Inquiries',
      metaDescription: 'Get in touch with Pune City Zonal Sports Committee secretariat at Poona College Camp, Pune. Send inquiries, sports scheduling requests, and administrative communications.',
      metaKeywords: 'Contact PCZSC, Poona College Camp Sports Office, PCZSC Address, Pune Sports Committee Phone',
      canonicalUrl: 'https://pczsc.in/en/contact-us'
    },
    robots: {
      index: true,
      follow: true,
      noArchive: false,
      noSnippet: false
    },
    og: {
      ogTitle: 'Contact PCZSC Secretariat - Pune Office',
      ogDescription: 'Reach out to Pune City Zonal Sports Committee office for tournament inquiries and support.',
      ogImage: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=1200&q=80',
      ogUrl: 'https://pczsc.in/en/contact-us',
      ogType: 'website'
    },
    twitter: {
      cardType: 'summary_large_image',
      twitterTitle: 'Contact PCZSC Office - Poona College Camp',
      twitterDescription: 'Connect with Pune City Zonal Sports Committee administration.',
      twitterImage: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=1200&q=80'
    },
    sitemap: {
      includeInSitemap: true,
      priority: 0.7,
      changeFreq: 'monthly'
    },
    favicon: { ...defaultFavicon },
    additional: {
      author: 'PCZSC Secretariat',
      language: 'en',
      themeColor: '#d97706',
      customHeadTags: ''
    }
  }
};

/**
 * Builds standard XML sitemap for all pages enabled for sitemap inclusion
 */
export function generateXmlSitemap(seoStore: SEOStore, domain: string = 'https://pczsc.in'): string {
  const pages = Object.values({ ...DEFAULT_PAGE_SEO, ...seoStore });
  const sitemapEntries = pages
    .filter((p) => p.sitemap.includeInSitemap && p.robots.index)
    .map((p) => {
      const loc = p.basic.canonicalUrl || `${domain}${p.pagePath}`;
      const lastmod = new Date().toISOString().split('T')[0];
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${p.sitemap.changeFreq}</changefreq>
    <priority>${p.sitemap.priority.toFixed(1)}</priority>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>`;
}

/**
 * Generates content for standard robots.txt file
 */
export function generateRobotsTxt(seoStore: SEOStore, domain: string = 'https://pczsc.in'): string {
  const pages = Object.values({ ...DEFAULT_PAGE_SEO, ...seoStore });
  const disallowedPaths = pages
    .filter((p) => !p.robots.index)
    .map((p) => `Disallow: ${p.pagePath}`);

  return `User-agent: *
Allow: /
Disallow: /en/admin
Disallow: /en/theme-editor
${disallowedPaths.join('\n')}

Sitemap: ${domain}/sitemap.xml`;
}

/**
 * Formats robots meta string from boolean flags
 */
export function formatRobotsMetaTag(robots: PageSEOConfig['robots']): string {
  const parts: string[] = [];
  parts.push(robots.index ? 'index' : 'noindex');
  parts.push(robots.follow ? 'follow' : 'nofollow');
  if (robots.noArchive) parts.push('noarchive');
  if (robots.noSnippet) parts.push('nosnippet');
  return parts.join(', ');
}
