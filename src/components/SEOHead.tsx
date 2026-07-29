import React, { useEffect } from 'react';
import { useCMS } from '../context/CMSContext';
import { PageSEOConfig } from '../types/seo';
import { formatRobotsMetaTag } from '../utils/sitemapGenerator';

interface SEOHeadProps {
  pageKey: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ pageKey }) => {
  const { seoStore } = useCMS();

  useEffect(() => {
    const config: PageSEOConfig | undefined = seoStore[pageKey];
    if (!config) return;

    // 1. Update Document Title
    const title = config.basic.metaTitle || `${config.pageName} | Pune City Zonal Sports Committee`;
    document.title = title;

    // Helper: Insert or Update meta tag by name or property
    const setMetaTag = (attrName: 'name' | 'property', attrValue: string, content: string) => {
      if (!content) return;
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper: Insert or Update link tag by rel and sizes
    const setLinkTag = (rel: string, href: string, type?: string, sizes?: string) => {
      if (!href) return;
      const selector = sizes ? `link[rel="${rel}"][sizes="${sizes}"]` : `link[rel="${rel}"]`;
      let element = document.querySelector(selector) as HTMLLinkElement;
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        if (sizes) element.setAttribute('sizes', sizes);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
      if (type) element.setAttribute('type', type);
    };

    // 2. Basic Meta Tags
    setMetaTag('name', 'description', config.basic.metaDescription);
    setMetaTag('name', 'keywords', config.basic.metaKeywords);
    setMetaTag('name', 'author', config.additional.author || 'Pune City Zonal Sports Committee');
    setMetaTag('name', 'language', config.additional.language || 'en');
    setMetaTag('name', 'theme-color', config.additional.themeColor || '#d97706');

    // Canonical & Sitemap Link
    const canonical = config.basic.canonicalUrl || `https://pczsc.in${config.pagePath}`;
    setLinkTag('canonical', canonical);
    setLinkTag('sitemap', 'https://pczsc.in/sitemap.xml', 'application/xml');

    // 3. Dynamic Favicon & Touch Icon Injector
    if (config.favicon) {
      if (config.favicon.faviconUrl) {
        setLinkTag('icon', config.favicon.faviconUrl, 'image/x-icon');
        setLinkTag('shortcut icon', config.favicon.faviconUrl);
      }
      if (config.favicon.favicon32Url) {
        setLinkTag('icon', config.favicon.favicon32Url, 'image/png', '32x32');
      }
      if (config.favicon.favicon16Url) {
        setLinkTag('icon', config.favicon.favicon16Url, 'image/png', '16x16');
      }
      if (config.favicon.appleTouchIconUrl) {
        setLinkTag('apple-touch-icon', config.favicon.appleTouchIconUrl, 'image/png', '180x180');
      }
      if (config.favicon.manifestUrl) {
        setLinkTag('manifest', config.favicon.manifestUrl);
      }
    }

    // 4. Robots Meta Tag
    const robotsContent = formatRobotsMetaTag(config.robots);
    setMetaTag('name', 'robots', robotsContent);

    // 5. Open Graph Meta Tags
    const ogTitle = config.og.ogTitle || config.basic.metaTitle || title;
    const ogDesc = config.og.ogDescription || config.basic.metaDescription;
    const ogImg = config.og.ogImage || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80';
    const ogUrl = config.og.ogUrl || canonical;

    setMetaTag('property', 'og:title', ogTitle);
    setMetaTag('property', 'og:description', ogDesc);
    setMetaTag('property', 'og:image', ogImg);
    setMetaTag('property', 'og:url', ogUrl);
    setMetaTag('property', 'og:type', config.og.ogType || 'website');
    setMetaTag('property', 'og:site_name', 'Pune City Zonal Sports Committee');

    // 6. Twitter Card Meta Tags
    const twTitle = config.twitter.twitterTitle || ogTitle;
    const twDesc = config.twitter.twitterDescription || ogDesc;
    const twImg = config.twitter.twitterImage || ogImg;

    setMetaTag('name', 'twitter:card', config.twitter.cardType || 'summary_large_image');
    setMetaTag('name', 'twitter:title', twTitle);
    setMetaTag('name', 'twitter:description', twDesc);
    setMetaTag('name', 'twitter:image', twImg);

    // 7. Inject Custom Head Tags (if provided)
    if (config.additional.customHeadTags && config.additional.customHeadTags.trim()) {
      const containerId = `custom-seo-tags-${pageKey}`;
      let container = document.getElementById(containerId);
      if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        document.head.appendChild(container);
      }
      container.innerHTML = config.additional.customHeadTags;
    }
  }, [pageKey, seoStore]);

  return null;
};
