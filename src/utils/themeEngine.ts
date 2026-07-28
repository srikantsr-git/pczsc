import { ThemeConfig } from '../types/theme';

/**
 * Converts HEX color to RGB object
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split('')
      .map((char) => char + char)
      .join('');
  }
  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
};

/**
 * Calculates Relative Luminance (WCAG 2.1)
 */
export const getLuminance = (r: number, g: number, b: number): number => {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

/**
 * Calculates WCAG Contrast Ratio between two hex colors
 */
export const calculateContrastRatio = (fgHex: string, bgHex: string): number => {
  try {
    const rgb1 = hexToRgb(fgHex);
    const rgb2 = hexToRgb(bgHex);
    const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
    const brightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);
    return Number(((brightest + 0.05) / (darkest + 0.05)).toFixed(2));
  } catch {
    return 1;
  }
};

export const getWcagStatus = (fgHex: string, bgHex: string) => {
  const ratio = calculateContrastRatio(fgHex, bgHex);
  return {
    ratio,
    passAA: ratio >= 4.5,
    passAAA: ratio >= 7.0
  };
};

/**
 * Dynamically loads Google Font stylesheet tag if not present
 */
export const loadGoogleFont = (fontFamily: string) => {
  const fontSlug = fontFamily.replace(/\s+/g, '+');
  const linkId = `google-font-${fontSlug}`;
  if (!document.getElementById(linkId)) {
    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontSlug}:wght@300;400;500;600;700;800;900&display=swap`;
    document.head.appendChild(link);
  }
};

/**
 * Generates CSS Variables stylesheet from ThemeConfig
 */
export const generateCssVariables = (theme: ThemeConfig): string => {
  const primaryHex = theme.primaryColors.primary || '#d70c19';
  const secondaryHex = theme.primaryColors.secondary || '#0f172a';
  const bodyBgHex = theme.backgroundColors.body || '#ffffff';
  const sidebarBgHex = theme.backgroundColors.sidebar || '#0f172a';

  return `:root {
  /* Primary Colors */
  --primary: ${primaryHex};
  --santic-red: ${primaryHex};
  --santic-hoverRed: ${primaryHex}dd;
  --secondary: ${secondaryHex};
  --accent: ${theme.primaryColors.accent};
  --success: ${theme.primaryColors.success};
  --warning: ${theme.primaryColors.warning};
  --danger: ${theme.primaryColors.danger};
  --info: ${theme.primaryColors.info};

  /* Background Colors */
  --bg-body: ${bodyBgHex};
  --bg-page: ${theme.backgroundColors.page};
  --bg-card: ${theme.backgroundColors.card};
  --bg-section: ${theme.backgroundColors.section};
  --bg-sidebar: ${sidebarBgHex};
  --bg-navbar: ${theme.backgroundColors.navbar};
  --bg-footer: ${theme.backgroundColors.footer};
  --bg-modal: ${theme.backgroundColors.modal};
  --bg-dropdown: ${theme.backgroundColors.dropdown};

  /* Text Colors */
  --text-primary: ${theme.textColors.primary};
  --text-secondary: ${theme.textColors.secondary};
  --text-muted: ${theme.textColors.muted};
  --text-heading: ${theme.textColors.heading};
  --text-link: ${theme.textColors.link};
  --text-link-hover: ${theme.textColors.linkHover};
  --text-disabled: ${theme.textColors.disabled};
  --text-placeholder: ${theme.textColors.placeholder};

  /* Border Colors */
  --border-normal: ${theme.borderColors.normal};
  --border-hover: ${theme.borderColors.hover};
  --border-active: ${theme.borderColors.active};
  --border-focus: ${theme.borderColors.focus};
  --border-divider: ${theme.borderColors.divider};

  /* Typography & Custom Font Sizes */
  --font-body: '${theme.typography.bodyFont}', sans-serif;
  --font-heading: '${theme.typography.headingFont}', sans-serif;
  --font-button: '${theme.typography.buttonFont}', sans-serif;
  --font-code: ${theme.typography.codeFont};
  --font-size-base: ${theme.typography.baseFontSize || 18}px;
  --font-size-heading: ${theme.typography.headingFontSize || 30}px;
  --font-size-paragraph: ${theme.typography.paragraphFontSize || 17}px;
  --font-size-menu: ${theme.typography.menuFontSize || 16}px;
  --font-size-logo: ${theme.typography.logoFontSize || 20}px;
  --font-size-footer-heading: ${theme.typography.footerHeadingFontSize || 15}px;
  --font-size-footer-body: ${theme.typography.footerBodyFontSize || 14}px;
  --line-height-base: ${theme.typography.lineHeight};
  --letter-spacing-base: ${theme.typography.letterSpacing};

  /* Headings */
  --h1-size: ${theme.headingStyles.h1.fontSize};
  --h1-weight: ${theme.headingStyles.h1.fontWeight};
  --h1-color: ${theme.headingStyles.h1.color};
  --h2-size: ${theme.headingStyles.h2.fontSize};
  --h2-weight: ${theme.headingStyles.h2.fontWeight};
  --h2-color: ${theme.headingStyles.h2.color};

  /* Layout & Spacing */
  --container-width: ${theme.layout.containerWidth};
  --sidebar-width: ${theme.layout.sidebarWidth};
  --navbar-height: ${theme.layout.navbarHeight};
  --footer-height: ${theme.layout.footerHeight};
  --page-padding: ${theme.layout.pagePadding};
  --card-padding: ${theme.layout.cardPadding};
  --grid-gap: ${theme.layout.gridGap};

  /* Border Radius */
  --radius-global: ${theme.radii.global};
  --radius-card: ${theme.radii.card};
  --radius-button: ${theme.radii.button};
  --radius-input: ${theme.radii.input};
  --radius-modal: ${theme.radii.modal};
  --radius-dropdown: ${theme.radii.dropdown};
  --radius-table: ${theme.radii.table};
  --radius-avatar: ${theme.radii.avatar};

  /* Animations */
  --transition-duration: ${theme.animations.duration}ms;
  --transition-timing: ${theme.animations.timingFunction};
}

html, body {
  font-family: var(--font-body) !important;
  font-size: var(--font-size-base) !important;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading) !important;
}

/* Global utility overrides for instant preset reflection */
.bg-santic-red {
  background-color: var(--santic-red) !important;
}
.text-santic-red {
  color: var(--santic-red) !important;
}
.border-santic-red {
  border-color: var(--santic-red) !important;
}
.hover\:bg-santic-hoverRed:hover {
  background-color: var(--santic-hoverRed) !important;
}
.hover\:text-santic-red:hover {
  color: var(--santic-red) !important;
}
.selection\:bg-santic-red::selection {
  background-color: var(--santic-red) !important;
}
`;
};

/**
 * Dynamically applies CSS variables & font loaders to document head / documentElement
 */
export const applyThemeCssVariables = (theme: ThemeConfig): void => {
  if (theme.typography.bodyFont) loadGoogleFont(theme.typography.bodyFont);
  if (theme.typography.headingFont) loadGoogleFont(theme.typography.headingFont);

  const css = generateCssVariables(theme);
  let styleEl = document.getElementById('theme-editor-dynamic-styles');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'theme-editor-dynamic-styles';
    document.head.appendChild(styleEl);
  }
  styleEl.innerHTML = css;

  // Toggle Dark Mode Class on root element
  if (theme.darkMode.isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

/**
 * Generates matching tailwind.config.js string
 */
export const generateTailwindConfig = (theme: ThemeConfig): string => {
  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
        info: 'var(--info)',
        body: 'var(--bg-body)',
        page: 'var(--bg-page)',
        card: 'var(--bg-card)',
        sidebar: 'var(--bg-sidebar)',
        navbar: 'var(--bg-navbar)',
        border: 'var(--border-normal)',
      },
      fontFamily: {
        sans: ['var(--font-body)'],
        heading: ['var(--font-heading)'],
        mono: ['var(--font-code)'],
      },
      borderRadius: {
        DEFAULT: 'var(--radius-global)',
        card: 'var(--radius-card)',
        button: 'var(--radius-button)',
        input: 'var(--radius-input)',
        modal: 'var(--radius-modal)',
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
};`;
};

export const exportThemeJson = (theme: ThemeConfig): string => {
  return JSON.stringify(theme, null, 2);
};

export const validateThemeJson = (jsonString: string): ThemeConfig | null => {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed && parsed.name && parsed.primaryColors && parsed.typography) {
      return parsed as ThemeConfig;
    }
    return null;
  } catch {
    return null;
  }
};
