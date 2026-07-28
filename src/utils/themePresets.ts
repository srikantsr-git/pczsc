import { ThemeConfig, PresetThemeId } from '../types/theme';

export const PRESET_THEMES: Record<PresetThemeId, ThemeConfig> = {
  'default-light': {
    id: 'preset-default-light',
    name: 'Default Light',
    presetId: 'default-light',
    description: 'Clean modern athletic white and vibrant red header design.',
    updatedAt: new Date().toISOString(),
    primaryColors: {
      primary: '#d9232a',
      secondary: '#0f172a',
      accent: '#38bdf8',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
      info: '#3b82f6'
    },
    backgroundColors: {
      body: '#ffffff',
      page: '#f8fafc',
      card: '#ffffff',
      section: '#f1f5f9',
      sidebar: '#0f172a',
      navbar: '#ffffff',
      footer: '#0f172a',
      modal: '#ffffff',
      dropdown: '#ffffff'
    },
    textColors: {
      primary: '#0f172a',
      secondary: '#475569',
      muted: '#94a3b8',
      heading: '#0f172a',
      link: '#d9232a',
      linkHover: '#b91c1c',
      disabled: '#cbd5e1',
      placeholder: '#94a3b8'
    },
    borderColors: {
      normal: '#e2e8f0',
      hover: '#cbd5e1',
      active: '#d9232a',
      focus: '#d9232a',
      divider: '#f1f5f9'
    },
    typography: {
      bodyFont: 'Inter',
      headingFont: 'Poppins',
      buttonFont: 'Inter',
      tableFont: 'Inter',
      sidebarFont: 'Inter',
      navbarFont: 'Inter',
      codeFont: 'ui-monospace, monospace',
      baseFontSize: 18,
      headingFontSize: 30,
      paragraphFontSize: 17,
      menuFontSize: 16,
      logoFontSize: 20,
      footerHeadingFontSize: 15,
      footerBodyFontSize: 14,
      lineHeight: 1.5,
      letterSpacing: '0em',
      fontWeight: '400',
      textTransform: 'none'
    },
    headingStyles: {
      h1: { fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.025em' },
      h2: { fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.75rem', letterSpacing: '-0.025em' },
      h3: { fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem', letterSpacing: '0em' },
      h4: { fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem', letterSpacing: '0em' },
      h5: { fontSize: '1rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.25rem', letterSpacing: '0em' },
      h6: { fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.25rem', letterSpacing: '0em' }
    },
    layout: {
      containerWidth: '1280px',
      sidebarWidth: '280px',
      navbarHeight: '72px',
      footerHeight: '80px',
      pagePadding: '1.5rem',
      cardPadding: '1.5rem',
      gridGap: '1.5rem'
    },
    radii: {
      global: '0.75rem',
      card: '1rem',
      button: '0.75rem',
      input: '0.75rem',
      modal: '1.5rem',
      dropdown: '0.75rem',
      table: '1rem',
      avatar: '9999px'
    },
    shadows: {
      card: 'md',
      button: 'sm',
      modal: 'xl',
      dropdown: 'lg'
    },
    animations: {
      enabled: true,
      type: 'fade',
      duration: 300,
      timingFunction: 'ease-in-out'
    },
    darkMode: {
      mode: 'light',
      isDark: false
    },
    accessibility: {
      highContrast: false,
      colorBlindSafe: false,
      largeFonts: false,
      reducedMotion: false,
      focusRings: true,
      wcagCompliance: 'AA'
    }
  },

  'default-dark': {
    id: 'preset-default-dark',
    name: 'Default Dark',
    presetId: 'default-dark',
    description: 'Sleek dark mode with deep slate tones and glowing red accents.',
    updatedAt: new Date().toISOString(),
    primaryColors: {
      primary: '#ef4444',
      secondary: '#f8fafc',
      accent: '#38bdf8',
      success: '#10b981',
      warning: '#fbbf24',
      danger: '#f87171',
      info: '#60a5fa'
    },
    backgroundColors: {
      body: '#090d16',
      page: '#0f172a',
      card: '#1e293b',
      section: '#0f172a',
      sidebar: '#020617',
      navbar: '#0f172a',
      footer: '#020617',
      modal: '#1e293b',
      dropdown: '#1e293b'
    },
    textColors: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
      muted: '#64748b',
      heading: '#ffffff',
      link: '#ef4444',
      linkHover: '#f87171',
      disabled: '#475569',
      placeholder: '#64748b'
    },
    borderColors: {
      normal: '#334155',
      hover: '#475569',
      active: '#ef4444',
      focus: '#ef4444',
      divider: '#1e293b'
    },
    typography: {
      bodyFont: 'Inter',
      headingFont: 'Poppins',
      buttonFont: 'Inter',
      tableFont: 'Inter',
      sidebarFont: 'Inter',
      navbarFont: 'Inter',
      codeFont: 'ui-monospace, monospace',
      baseFontSize: 16,
      lineHeight: 1.5,
      letterSpacing: '0em',
      fontWeight: '400',
      textTransform: 'none'
    },
    headingStyles: {
      h1: { fontSize: '2.5rem', fontWeight: '800', color: '#ffffff', marginBottom: '1rem', letterSpacing: '-0.025em' },
      h2: { fontSize: '2rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.75rem', letterSpacing: '-0.025em' },
      h3: { fontSize: '1.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.5rem', letterSpacing: '0em' },
      h4: { fontSize: '1.25rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.5rem', letterSpacing: '0em' },
      h5: { fontSize: '1rem', fontWeight: '600', color: '#ffffff', marginBottom: '0.25rem', letterSpacing: '0em' },
      h6: { fontSize: '0.875rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '0.25rem', letterSpacing: '0em' }
    },
    layout: {
      containerWidth: '1280px',
      sidebarWidth: '280px',
      navbarHeight: '72px',
      footerHeight: '80px',
      pagePadding: '1.5rem',
      cardPadding: '1.5rem',
      gridGap: '1.5rem'
    },
    radii: {
      global: '0.75rem',
      card: '1rem',
      button: '0.75rem',
      input: '0.75rem',
      modal: '1.5rem',
      dropdown: '0.75rem',
      table: '1rem',
      avatar: '9999px'
    },
    shadows: {
      card: 'lg',
      button: 'md',
      modal: 'xl',
      dropdown: 'xl'
    },
    animations: {
      enabled: true,
      type: 'fade',
      duration: 300,
      timingFunction: 'ease-in-out'
    },
    darkMode: {
      mode: 'dark',
      isDark: true
    },
    accessibility: {
      highContrast: false,
      colorBlindSafe: false,
      largeFonts: false,
      reducedMotion: false,
      focusRings: true,
      wcagCompliance: 'AA'
    }
  },

  'corporate-blue': {
    id: 'preset-corporate-blue',
    name: 'Corporate Blue',
    presetId: 'corporate-blue',
    description: 'Executive royal blue theme tailored for institutional governance.',
    updatedAt: new Date().toISOString(),
    primaryColors: {
      primary: '#2563eb',
      secondary: '#1e40af',
      accent: '#06b6d4',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#dc2626',
      info: '#3b82f6'
    },
    backgroundColors: {
      body: '#f0f9ff',
      page: '#f8fafc',
      card: '#ffffff',
      section: '#e0f2fe',
      sidebar: '#1e3a8a',
      navbar: '#ffffff',
      footer: '#1e3a8a',
      modal: '#ffffff',
      dropdown: '#ffffff'
    },
    textColors: {
      primary: '#1e293b',
      secondary: '#475569',
      muted: '#64748b',
      heading: '#1e3a8a',
      link: '#2563eb',
      linkHover: '#1d4ed8',
      disabled: '#cbd5e1',
      placeholder: '#94a3b8'
    },
    borderColors: {
      normal: '#bae6fd',
      hover: '#93c5fd',
      active: '#2563eb',
      focus: '#2563eb',
      divider: '#e0f2fe'
    },
    typography: {
      bodyFont: 'Roboto',
      headingFont: 'Montserrat',
      buttonFont: 'Roboto',
      tableFont: 'Roboto',
      sidebarFont: 'Roboto',
      navbarFont: 'Roboto',
      codeFont: 'monospace',
      baseFontSize: 16,
      lineHeight: 1.5,
      letterSpacing: '0em',
      fontWeight: '400',
      textTransform: 'none'
    },
    headingStyles: {
      h1: { fontSize: '2.5rem', fontWeight: '800', color: '#1e3a8a', marginBottom: '1rem', letterSpacing: '-0.025em' },
      h2: { fontSize: '2rem', fontWeight: '800', color: '#1e3a8a', marginBottom: '0.75rem', letterSpacing: '-0.025em' },
      h3: { fontSize: '1.5rem', fontWeight: '700', color: '#1e3a8a', marginBottom: '0.5rem', letterSpacing: '0em' },
      h4: { fontSize: '1.25rem', fontWeight: '700', color: '#1e3a8a', marginBottom: '0.5rem', letterSpacing: '0em' },
      h5: { fontSize: '1rem', fontWeight: '600', color: '#1e3a8a', marginBottom: '0.25rem', letterSpacing: '0em' },
      h6: { fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.25rem', letterSpacing: '0em' }
    },
    layout: {
      containerWidth: '1280px',
      sidebarWidth: '280px',
      navbarHeight: '72px',
      footerHeight: '80px',
      pagePadding: '1.5rem',
      cardPadding: '1.5rem',
      gridGap: '1.5rem'
    },
    radii: {
      global: '0.5rem',
      card: '0.75rem',
      button: '0.5rem',
      input: '0.5rem',
      modal: '1rem',
      dropdown: '0.5rem',
      table: '0.75rem',
      avatar: '9999px'
    },
    shadows: {
      card: 'md',
      button: 'sm',
      modal: 'lg',
      dropdown: 'md'
    },
    animations: {
      enabled: true,
      type: 'fade',
      duration: 250,
      timingFunction: 'ease-out'
    },
    darkMode: { mode: 'light', isDark: false },
    accessibility: { highContrast: false, colorBlindSafe: false, largeFonts: false, reducedMotion: false, focusRings: true, wcagCompliance: 'AA' }
  },

  'emerald-nature': {
    id: 'preset-emerald-nature',
    name: 'Emerald Nature',
    presetId: 'emerald-nature',
    description: 'Refreshing green theme representing growth, outdoor sports & vitality.',
    updatedAt: new Date().toISOString(),
    primaryColors: {
      primary: '#059669',
      secondary: '#065f46',
      accent: '#10b981',
      success: '#10b981',
      warning: '#d97706',
      danger: '#dc2626',
      info: '#0284c7'
    },
    backgroundColors: {
      body: '#f0fdf4',
      page: '#f6fbf7',
      card: '#ffffff',
      section: '#dcfce7',
      sidebar: '#064e3b',
      navbar: '#ffffff',
      footer: '#064e3b',
      modal: '#ffffff',
      dropdown: '#ffffff'
    },
    textColors: {
      primary: '#064e3b',
      secondary: '#374151',
      muted: '#6b7280',
      heading: '#065f46',
      link: '#059669',
      linkHover: '#047857',
      disabled: '#d1d5db',
      placeholder: '#9ca3af'
    },
    borderColors: {
      normal: '#a7f3d0',
      hover: '#6ee7b7',
      active: '#059669',
      focus: '#059669',
      divider: '#dcfce7'
    },
    typography: {
      bodyFont: 'Nunito',
      headingFont: 'Poppins',
      buttonFont: 'Nunito',
      tableFont: 'Nunito',
      sidebarFont: 'Nunito',
      navbarFont: 'Nunito',
      codeFont: 'monospace',
      baseFontSize: 16,
      lineHeight: 1.5,
      letterSpacing: '0em',
      fontWeight: '400',
      textTransform: 'none'
    },
    headingStyles: {
      h1: { fontSize: '2.5rem', fontWeight: '800', color: '#065f46', marginBottom: '1rem', letterSpacing: '-0.025em' },
      h2: { fontSize: '2rem', fontWeight: '800', color: '#065f46', marginBottom: '0.75rem', letterSpacing: '-0.025em' },
      h3: { fontSize: '1.5rem', fontWeight: '700', color: '#065f46', marginBottom: '0.5rem', letterSpacing: '0em' },
      h4: { fontSize: '1.25rem', fontWeight: '700', color: '#065f46', marginBottom: '0.5rem', letterSpacing: '0em' },
      h5: { fontSize: '1rem', fontWeight: '600', color: '#065f46', marginBottom: '0.25rem', letterSpacing: '0em' },
      h6: { fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.25rem', letterSpacing: '0em' }
    },
    layout: { containerWidth: '1280px', sidebarWidth: '280px', navbarHeight: '72px', footerHeight: '80px', pagePadding: '1.5rem', cardPadding: '1.5rem', gridGap: '1.5rem' },
    radii: { global: '1rem', card: '1.25rem', button: '1rem', input: '0.75rem', modal: '1.5rem', dropdown: '0.75rem', table: '1rem', avatar: '9999px' },
    shadows: { card: 'md', button: 'sm', modal: 'xl', dropdown: 'md' },
    animations: { enabled: true, type: 'scale', duration: 300, timingFunction: 'ease-in-out' },
    darkMode: { mode: 'light', isDark: false },
    accessibility: { highContrast: false, colorBlindSafe: true, largeFonts: false, reducedMotion: false, focusRings: true, wcagCompliance: 'AA' }
  },

  'purple-luxury': {
    id: 'preset-purple-luxury',
    name: 'Purple Luxury',
    presetId: 'purple-luxury',
    description: 'High-end deep violet and gold accent premium design.',
    updatedAt: new Date().toISOString(),
    primaryColors: {
      primary: '#7c3aed',
      secondary: '#4c1d95',
      accent: '#f59e0b',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#e11d48',
      info: '#6366f1'
    },
    backgroundColors: {
      body: '#faf5ff',
      page: '#f3e8ff',
      card: '#ffffff',
      section: '#e9d5ff',
      sidebar: '#3b0764',
      navbar: '#ffffff',
      footer: '#3b0764',
      modal: '#ffffff',
      dropdown: '#ffffff'
    },
    textColors: {
      primary: '#3b0764',
      secondary: '#5b21b6',
      muted: '#8b5cf6',
      heading: '#4c1d95',
      link: '#7c3aed',
      linkHover: '#6d28d9',
      disabled: '#ddd6fe',
      placeholder: '#a78bfa'
    },
    borderColors: {
      normal: '#ddd6fe',
      hover: '#c4b5fd',
      active: '#7c3aed',
      focus: '#7c3aed',
      divider: '#e9d5ff'
    },
    typography: {
      bodyFont: 'Manrope',
      headingFont: 'Montserrat',
      buttonFont: 'Manrope',
      tableFont: 'Manrope',
      sidebarFont: 'Manrope',
      navbarFont: 'Manrope',
      codeFont: 'monospace',
      baseFontSize: 16,
      lineHeight: 1.5,
      letterSpacing: '0em',
      fontWeight: '400',
      textTransform: 'none'
    },
    headingStyles: {
      h1: { fontSize: '2.5rem', fontWeight: '800', color: '#4c1d95', marginBottom: '1rem', letterSpacing: '-0.025em' },
      h2: { fontSize: '2rem', fontWeight: '800', color: '#4c1d95', marginBottom: '0.75rem', letterSpacing: '-0.025em' },
      h3: { fontSize: '1.5rem', fontWeight: '700', color: '#4c1d95', marginBottom: '0.5rem', letterSpacing: '0em' },
      h4: { fontSize: '1.25rem', fontWeight: '700', color: '#4c1d95', marginBottom: '0.5rem', letterSpacing: '0em' },
      h5: { fontSize: '1rem', fontWeight: '600', color: '#4c1d95', marginBottom: '0.25rem', letterSpacing: '0em' },
      h6: { fontSize: '0.875rem', fontWeight: '600', color: '#5b21b6', marginBottom: '0.25rem', letterSpacing: '0em' }
    },
    layout: { containerWidth: '1280px', sidebarWidth: '280px', navbarHeight: '72px', footerHeight: '80px', pagePadding: '1.5rem', cardPadding: '1.5rem', gridGap: '1.5rem' },
    radii: { global: '1rem', card: '1.5rem', button: '1rem', input: '0.75rem', modal: '2rem', dropdown: '1rem', table: '1rem', avatar: '9999px' },
    shadows: { card: 'lg', button: 'md', modal: 'xl', dropdown: 'lg' },
    animations: { enabled: true, type: 'hover-lift', duration: 300, timingFunction: 'ease-in-out' },
    darkMode: { mode: 'light', isDark: false },
    accessibility: { highContrast: false, colorBlindSafe: false, largeFonts: false, reducedMotion: false, focusRings: true, wcagCompliance: 'AA' }
  },

  'sunset-orange': {
    id: 'preset-sunset-orange',
    name: 'Sunset Orange',
    presetId: 'sunset-orange',
    description: 'Energetic warm orange and amber gradient sports theme.',
    updatedAt: new Date().toISOString(),
    primaryColors: {
      primary: '#ea580c',
      secondary: '#9a3412',
      accent: '#f59e0b',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
      info: '#0284c7'
    },
    backgroundColors: {
      body: '#fff7ed',
      page: '#ffedd5',
      card: '#ffffff',
      section: '#fed7aa',
      sidebar: '#7c2d12',
      navbar: '#ffffff',
      footer: '#7c2d12',
      modal: '#ffffff',
      dropdown: '#ffffff'
    },
    textColors: {
      primary: '#431407',
      secondary: '#7c2d12',
      muted: '#9a3412',
      heading: '#7c2d12',
      link: '#ea580c',
      linkHover: '#c2410c',
      disabled: '#fed7aa',
      placeholder: '#fb923c'
    },
    borderColors: {
      normal: '#fed7aa',
      hover: '#fdba74',
      active: '#ea580c',
      focus: '#ea580c',
      divider: '#ffedd5'
    },
    typography: { bodyFont: 'Poppins', headingFont: 'Montserrat', buttonFont: 'Poppins', tableFont: 'Poppins', sidebarFont: 'Poppins', navbarFont: 'Poppins', codeFont: 'monospace', baseFontSize: 16, lineHeight: 1.5, letterSpacing: '0em', fontWeight: '400', textTransform: 'none' },
    headingStyles: {
      h1: { fontSize: '2.5rem', fontWeight: '800', color: '#7c2d12', marginBottom: '1rem', letterSpacing: '-0.025em' },
      h2: { fontSize: '2rem', fontWeight: '800', color: '#7c2d12', marginBottom: '0.75rem', letterSpacing: '-0.025em' },
      h3: { fontSize: '1.5rem', fontWeight: '700', color: '#7c2d12', marginBottom: '0.5rem', letterSpacing: '0em' },
      h4: { fontSize: '1.25rem', fontWeight: '700', color: '#7c2d12', marginBottom: '0.5rem', letterSpacing: '0em' },
      h5: { fontSize: '1rem', fontWeight: '600', color: '#7c2d12', marginBottom: '0.25rem', letterSpacing: '0em' },
      h6: { fontSize: '0.875rem', fontWeight: '600', color: '#9a3412', marginBottom: '0.25rem', letterSpacing: '0em' }
    },
    layout: { containerWidth: '1280px', sidebarWidth: '280px', navbarHeight: '72px', footerHeight: '80px', pagePadding: '1.5rem', cardPadding: '1.5rem', gridGap: '1.5rem' },
    radii: { global: '0.75rem', card: '1rem', button: '0.75rem', input: '0.75rem', modal: '1.5rem', dropdown: '0.75rem', table: '1rem', avatar: '9999px' },
    shadows: { card: 'md', button: 'sm', modal: 'xl', dropdown: 'md' },
    animations: { enabled: true, type: 'bounce', duration: 300, timingFunction: 'ease-in-out' },
    darkMode: { mode: 'light', isDark: false },
    accessibility: { highContrast: false, colorBlindSafe: false, largeFonts: false, reducedMotion: false, focusRings: true, wcagCompliance: 'AA' }
  },

  'rose-pink': {
    id: 'preset-rose-pink',
    name: 'Rose Pink',
    presetId: 'rose-pink',
    description: 'Chic magenta & rose pink modern sports interface.',
    updatedAt: new Date().toISOString(),
    primaryColors: {
      primary: '#e11d48',
      secondary: '#881337',
      accent: '#fb7185',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#be123c',
      info: '#0284c7'
    },
    backgroundColors: {
      body: '#fff1f2',
      page: '#ffe4e6',
      card: '#ffffff',
      section: '#fecdd3',
      sidebar: '#4c0519',
      navbar: '#ffffff',
      footer: '#4c0519',
      modal: '#ffffff',
      dropdown: '#ffffff'
    },
    textColors: {
      primary: '#4c0519',
      secondary: '#881337',
      muted: '#9f1239',
      heading: '#881337',
      link: '#e11d48',
      linkHover: '#be123c',
      disabled: '#fecdd3',
      placeholder: '#fda4af'
    },
    borderColors: { normal: '#fecdd3', hover: '#fda4af', active: '#e11d48', focus: '#e11d48', divider: '#ffe4e6' },
    typography: { bodyFont: 'Lato', headingFont: 'Poppins', buttonFont: 'Lato', tableFont: 'Lato', sidebarFont: 'Lato', navbarFont: 'Lato', codeFont: 'monospace', baseFontSize: 16, lineHeight: 1.5, letterSpacing: '0em', fontWeight: '400', textTransform: 'none' },
    headingStyles: {
      h1: { fontSize: '2.5rem', fontWeight: '800', color: '#881337', marginBottom: '1rem', letterSpacing: '-0.025em' },
      h2: { fontSize: '2rem', fontWeight: '800', color: '#881337', marginBottom: '0.75rem', letterSpacing: '-0.025em' },
      h3: { fontSize: '1.5rem', fontWeight: '700', color: '#881337', marginBottom: '0.5rem', letterSpacing: '0em' },
      h4: { fontSize: '1.25rem', fontWeight: '700', color: '#881337', marginBottom: '0.5rem', letterSpacing: '0em' },
      h5: { fontSize: '1rem', fontWeight: '600', color: '#881337', marginBottom: '0.25rem', letterSpacing: '0em' },
      h6: { fontSize: '0.875rem', fontWeight: '600', color: '#9f1239', marginBottom: '0.25rem', letterSpacing: '0em' }
    },
    layout: { containerWidth: '1280px', sidebarWidth: '280px', navbarHeight: '72px', footerHeight: '80px', pagePadding: '1.5rem', cardPadding: '1.5rem', gridGap: '1.5rem' },
    radii: { global: '0.75rem', card: '1rem', button: '0.75rem', input: '0.75rem', modal: '1.5rem', dropdown: '0.75rem', table: '1rem', avatar: '9999px' },
    shadows: { card: 'md', button: 'sm', modal: 'xl', dropdown: 'md' },
    animations: { enabled: true, type: 'fade', duration: 300, timingFunction: 'ease-in-out' },
    darkMode: { mode: 'light', isDark: false },
    accessibility: { highContrast: false, colorBlindSafe: false, largeFonts: false, reducedMotion: false, focusRings: true, wcagCompliance: 'AA' }
  },

  'ocean-cyan': {
    id: 'preset-ocean-cyan',
    name: 'Ocean Cyan',
    presetId: 'ocean-cyan',
    description: 'Refreshing cyan & aquatic deep blue sports dashboard theme.',
    updatedAt: new Date().toISOString(),
    primaryColors: {
      primary: '#0891b2',
      secondary: '#155e75',
      accent: '#06b6d4',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
      info: '#3b82f6'
    },
    backgroundColors: {
      body: '#ecfeff',
      page: '#cffaff',
      card: '#ffffff',
      section: '#a5f3fc',
      sidebar: '#083344',
      navbar: '#ffffff',
      footer: '#083344',
      modal: '#ffffff',
      dropdown: '#ffffff'
    },
    textColors: {
      primary: '#083344',
      secondary: '#155e75',
      muted: '#0e7490',
      heading: '#155e75',
      link: '#0891b2',
      linkHover: '#0e7490',
      disabled: '#a5f3fc',
      placeholder: '#67e8f9'
    },
    borderColors: { normal: '#a5f3fc', hover: '#67e8f9', active: '#0891b2', focus: '#0891b2', divider: '#cffaff' },
    typography: { bodyFont: 'Work Sans', headingFont: 'Montserrat', buttonFont: 'Work Sans', tableFont: 'Work Sans', sidebarFont: 'Work Sans', navbarFont: 'Work Sans', codeFont: 'monospace', baseFontSize: 16, lineHeight: 1.5, letterSpacing: '0em', fontWeight: '400', textTransform: 'none' },
    headingStyles: {
      h1: { fontSize: '2.5rem', fontWeight: '800', color: '#155e75', marginBottom: '1rem', letterSpacing: '-0.025em' },
      h2: { fontSize: '2rem', fontWeight: '800', color: '#155e75', marginBottom: '0.75rem', letterSpacing: '-0.025em' },
      h3: { fontSize: '1.5rem', fontWeight: '700', color: '#155e75', marginBottom: '0.5rem', letterSpacing: '0em' },
      h4: { fontSize: '1.25rem', fontWeight: '700', color: '#155e75', marginBottom: '0.5rem', letterSpacing: '0em' },
      h5: { fontSize: '1rem', fontWeight: '600', color: '#155e75', marginBottom: '0.25rem', letterSpacing: '0em' },
      h6: { fontSize: '0.875rem', fontWeight: '600', color: '#0e7490', marginBottom: '0.25rem', letterSpacing: '0em' }
    },
    layout: { containerWidth: '1280px', sidebarWidth: '280px', navbarHeight: '72px', footerHeight: '80px', pagePadding: '1.5rem', cardPadding: '1.5rem', gridGap: '1.5rem' },
    radii: { global: '0.75rem', card: '1rem', button: '0.75rem', input: '0.75rem', modal: '1.5rem', dropdown: '0.75rem', table: '1rem', avatar: '9999px' },
    shadows: { card: 'md', button: 'sm', modal: 'xl', dropdown: 'md' },
    animations: { enabled: true, type: 'slide', duration: 300, timingFunction: 'ease-in-out' },
    darkMode: { mode: 'light', isDark: false },
    accessibility: { highContrast: false, colorBlindSafe: false, largeFonts: false, reducedMotion: false, focusRings: true, wcagCompliance: 'AA' }
  },

  'minimal-gray': {
    id: 'preset-minimal-gray',
    name: 'Minimal Gray',
    presetId: 'minimal-gray',
    description: 'Monochrome, high-contrast ultra-clean neutral slate palette.',
    updatedAt: new Date().toISOString(),
    primaryColors: {
      primary: '#18181b',
      secondary: '#27272a',
      accent: '#52525b',
      success: '#16a34a',
      warning: '#ca8a04',
      danger: '#dc2626',
      info: '#2563eb'
    },
    backgroundColors: {
      body: '#ffffff',
      page: '#f4f4f5',
      card: '#ffffff',
      section: '#e4e4e7',
      sidebar: '#18181b',
      navbar: '#ffffff',
      footer: '#18181b',
      modal: '#ffffff',
      dropdown: '#ffffff'
    },
    textColors: {
      primary: '#18181b',
      secondary: '#3f3f46',
      muted: '#71717a',
      heading: '#09090b',
      link: '#18181b',
      linkHover: '#3f3f46',
      disabled: '#d4d4d8',
      placeholder: '#a1a1aa'
    },
    borderColors: { normal: '#e4e4e7', hover: '#d4d4d8', active: '#18181b', focus: '#18181b', divider: '#f4f4f5' },
    typography: { bodyFont: 'Source Sans Pro', headingFont: 'Inter', buttonFont: 'Source Sans Pro', tableFont: 'Source Sans Pro', sidebarFont: 'Source Sans Pro', navbarFont: 'Source Sans Pro', codeFont: 'monospace', baseFontSize: 16, lineHeight: 1.5, letterSpacing: '0em', fontWeight: '400', textTransform: 'none' },
    headingStyles: {
      h1: { fontSize: '2.5rem', fontWeight: '800', color: '#09090b', marginBottom: '1rem', letterSpacing: '-0.025em' },
      h2: { fontSize: '2rem', fontWeight: '800', color: '#09090b', marginBottom: '0.75rem', letterSpacing: '-0.025em' },
      h3: { fontSize: '1.5rem', fontWeight: '700', color: '#09090b', marginBottom: '0.5rem', letterSpacing: '0em' },
      h4: { fontSize: '1.25rem', fontWeight: '700', color: '#09090b', marginBottom: '0.5rem', letterSpacing: '0em' },
      h5: { fontSize: '1rem', fontWeight: '600', color: '#09090b', marginBottom: '0.25rem', letterSpacing: '0em' },
      h6: { fontSize: '0.875rem', fontWeight: '600', color: '#3f3f46', marginBottom: '0.25rem', letterSpacing: '0em' }
    },
    layout: { containerWidth: '1280px', sidebarWidth: '280px', navbarHeight: '72px', footerHeight: '80px', pagePadding: '1.5rem', cardPadding: '1.5rem', gridGap: '1.5rem' },
    radii: { global: '0.25rem', card: '0.375rem', button: '0.25rem', input: '0.25rem', modal: '0.5rem', dropdown: '0.25rem', table: '0.375rem', avatar: '9999px' },
    shadows: { card: 'sm', button: 'none', modal: 'lg', dropdown: 'sm' },
    animations: { enabled: true, type: 'fade', duration: 200, timingFunction: 'ease' },
    darkMode: { mode: 'light', isDark: false },
    accessibility: { highContrast: true, colorBlindSafe: true, largeFonts: false, reducedMotion: false, focusRings: true, wcagCompliance: 'AAA' }
  },

  'midnight-neon': {
    id: 'preset-midnight-neon',
    name: 'Midnight Neon',
    presetId: 'midnight-neon',
    description: 'Cyberpunk dark theme with glowing cyan & neon purple accents.',
    updatedAt: new Date().toISOString(),
    primaryColors: {
      primary: '#00f0ff',
      secondary: '#ff007f',
      accent: '#7000ff',
      success: '#00ff66',
      warning: '#ffaa00',
      danger: '#ff0055',
      info: '#00ccff'
    },
    backgroundColors: {
      body: '#030712',
      page: '#0b0f19',
      card: '#111827',
      section: '#0b0f19',
      sidebar: '#030712',
      navbar: '#0b0f19',
      footer: '#030712',
      modal: '#111827',
      dropdown: '#111827'
    },
    textColors: {
      primary: '#f3f4f6',
      secondary: '#9ca3af',
      muted: '#4b5563',
      heading: '#ffffff',
      link: '#00f0ff',
      linkHover: '#ff007f',
      disabled: '#374151',
      placeholder: '#4b5563'
    },
    borderColors: { normal: '#1f2937', hover: '#374151', active: '#00f0ff', focus: '#00f0ff', divider: '#111827' },
    typography: { bodyFont: 'Roboto', headingFont: 'Montserrat', buttonFont: 'Roboto', tableFont: 'Roboto', sidebarFont: 'Roboto', navbarFont: 'Roboto', codeFont: 'ui-monospace, monospace', baseFontSize: 16, lineHeight: 1.5, letterSpacing: '0.02em', fontWeight: '400', textTransform: 'none' },
    headingStyles: {
      h1: { fontSize: '2.5rem', fontWeight: '800', color: '#ffffff', marginBottom: '1rem', letterSpacing: '-0.025em' },
      h2: { fontSize: '2rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.75rem', letterSpacing: '-0.025em' },
      h3: { fontSize: '1.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.5rem', letterSpacing: '0em' },
      h4: { fontSize: '1.25rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.5rem', letterSpacing: '0em' },
      h5: { fontSize: '1rem', fontWeight: '600', color: '#ffffff', marginBottom: '0.25rem', letterSpacing: '0em' },
      h6: { fontSize: '0.875rem', fontWeight: '600', color: '#9ca3af', marginBottom: '0.25rem', letterSpacing: '0em' }
    },
    layout: { containerWidth: '1280px', sidebarWidth: '280px', navbarHeight: '72px', footerHeight: '80px', pagePadding: '1.5rem', cardPadding: '1.5rem', gridGap: '1.5rem' },
    radii: { global: '0.75rem', card: '1rem', button: '0.75rem', input: '0.75rem', modal: '1.5rem', dropdown: '0.75rem', table: '1rem', avatar: '9999px' },
    shadows: { card: 'xl', button: 'lg', modal: 'xl', dropdown: 'xl' },
    animations: { enabled: true, type: 'hover-lift', duration: 300, timingFunction: 'ease-in-out' },
    darkMode: { mode: 'dark', isDark: true },
    accessibility: { highContrast: true, colorBlindSafe: false, largeFonts: false, reducedMotion: false, focusRings: true, wcagCompliance: 'AA' }
  }
};
