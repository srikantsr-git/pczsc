export type FontFamily =
  | 'Inter'
  | 'Poppins'
  | 'Roboto'
  | 'Open Sans'
  | 'Nunito'
  | 'Lato'
  | 'Montserrat'
  | 'Work Sans'
  | 'Source Sans Pro'
  | 'Manrope';

export type PresetThemeId =
  | 'default-light'
  | 'default-dark'
  | 'corporate-blue'
  | 'emerald-nature'
  | 'purple-luxury'
  | 'sunset-orange'
  | 'rose-pink'
  | 'ocean-cyan'
  | 'minimal-gray'
  | 'midnight-neon';

export interface PrimaryColors {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
}

export interface BackgroundColors {
  body: string;
  page: string;
  card: string;
  section: string;
  sidebar: string;
  navbar: string;
  footer: string;
  modal: string;
  dropdown: string;
}

export interface TextColors {
  primary: string;
  secondary: string;
  muted: string;
  heading: string;
  link: string;
  linkHover: string;
  disabled: string;
  placeholder: string;
}

export interface BorderColors {
  normal: string;
  hover: string;
  active: string;
  focus: string;
  divider: string;
}

export interface HeadingStyleItem {
  fontSize: string; // e.g. "2.25rem"
  fontWeight: string; // e.g. "800"
  color: string;
  marginBottom: string;
  letterSpacing: string;
}

export interface HeadingStyles {
  h1: HeadingStyleItem;
  h2: HeadingStyleItem;
  h3: HeadingStyleItem;
  h4: HeadingStyleItem;
  h5: HeadingStyleItem;
  h6: HeadingStyleItem;
}

export interface TypographyConfig {
  bodyFont: FontFamily;
  headingFont: FontFamily;
  buttonFont: FontFamily;
  tableFont: FontFamily;
  sidebarFont: FontFamily;
  navbarFont: FontFamily;
  codeFont: string;
  baseFontSize: number; // in px, e.g. 16
  headingFontSize?: number; // in px, e.g. 28
  paragraphFontSize?: number; // in px, e.g. 15
  menuFontSize?: number; // in px, e.g. 14
  logoFontSize?: number; // in px, e.g. 18
  footerHeadingFontSize?: number; // in px, e.g. 13
  footerBodyFontSize?: number; // in px, e.g. 12
  lineHeight: number; // e.g. 1.5
  letterSpacing: string; // e.g. "0em"
  fontWeight: string; // e.g. "400"
  textTransform: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
}

export interface LayoutConfig {
  containerWidth: string; // e.g. "1280px"
  sidebarWidth: string; // e.g. "280px"
  navbarHeight: string; // e.g. "72px"
  footerHeight: string; // e.g. "80px"
  pagePadding: string; // e.g. "1.5rem"
  cardPadding: string; // e.g. "1.5rem"
  gridGap: string; // e.g. "1.5rem"
}

export interface RadiiConfig {
  global: string; // e.g. "0.75rem"
  card: string;
  button: string;
  input: string;
  modal: string;
  dropdown: string;
  table: string;
  avatar: string;
}

export interface ShadowsConfig {
  card: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  button: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  modal: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  dropdown: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
}

export interface AnimationsConfig {
  enabled: boolean;
  type: 'fade' | 'slide' | 'scale' | 'bounce' | 'ripple' | 'hover-lift';
  duration: number; // in ms, e.g. 300
  timingFunction: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

export interface DarkModeConfig {
  mode: 'system' | 'light' | 'dark' | 'auto';
  isDark: boolean;
}

export interface AccessibilityConfig {
  highContrast: boolean;
  colorBlindSafe: boolean;
  largeFonts: boolean;
  reducedMotion: boolean;
  focusRings: boolean;
  wcagCompliance: 'AA' | 'AAA' | 'None';
}

export interface ThemeConfig {
  id: string;
  name: string;
  presetId?: PresetThemeId;
  description: string;
  isCustom?: boolean;
  isDraft?: boolean;
  updatedAt: string;
  primaryColors: PrimaryColors;
  backgroundColors: BackgroundColors;
  textColors: TextColors;
  borderColors: BorderColors;
  typography: TypographyConfig;
  headingStyles: HeadingStyles;
  layout: LayoutConfig;
  radii: RadiiConfig;
  shadows: ShadowsConfig;
  animations: AnimationsConfig;
  darkMode: DarkModeConfig;
  accessibility: AccessibilityConfig;
}
