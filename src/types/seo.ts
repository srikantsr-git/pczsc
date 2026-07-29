export interface BasicMetaTags {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl: string;
}

export interface RobotsConfig {
  index: boolean;
  follow: boolean;
  noArchive: boolean;
  noSnippet: boolean;
}

export interface OpenGraphConfig {
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  ogType: string;
}

export interface TwitterCardConfig {
  cardType: 'summary' | 'summary_large_image';
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
}

export interface SitemapConfig {
  includeInSitemap: boolean;
  priority: number; // 0.1 to 1.0
  changeFreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
}

export interface FaviconConfig {
  faviconUrl: string; // Primary favicon (.ico, .png, .svg)
  favicon32Url: string; // 32x32 PNG
  favicon16Url: string; // 16x16 PNG
  appleTouchIconUrl: string; // 180x180 PNG for Apple devices
  manifestUrl: string; // Web app manifest (.json / .webmanifest)
}

export interface AdditionalMetaTags {
  author: string;
  language: string;
  themeColor: string;
  customHeadTags: string;
}

export interface PageSEOConfig {
  pageKey: string;
  pageName: string;
  pagePath: string;
  basic: BasicMetaTags;
  robots: RobotsConfig;
  og: OpenGraphConfig;
  twitter: TwitterCardConfig;
  sitemap: SitemapConfig;
  favicon: FaviconConfig;
  additional: AdditionalMetaTags;
}

export type SEOStore = Record<string, PageSEOConfig>;
