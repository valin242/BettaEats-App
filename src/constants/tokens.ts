export const Colors = {
  // Backgrounds
  bg: '#ffffff',
  bgElev: '#f6f9f6',
  surface: '#ffffff',

  // Foregrounds
  fg1: '#1c2b1c',
  fg2: '#3d5a3e',
  fg3: '#5a6a5a',
  fg4: '#7a8f7b',
  fg5: '#a0b0a0',
  fgOnDark: '#ffffff',
  fgOnDarkMuted: '#a8c5a8',

  // Borders
  border1: '#dde8d8',
  border2: '#e8ede8',

  // Brand
  brand: '#2d7a4f',
  brandDark: '#1c2b1c',
  brandMid: '#3d5a3e',
  brandPress: '#205838',
  brandSoft: '#e8f5ec',
  brandSoftBorder: '#90c9a4',

  // Status
  warnBg: '#fffbe8',
  warnFg: '#7a6010',
  warnBorder: '#f0d060',
  corrBg: '#f3eaf8',
  corrFg: '#5b2080',
  corrBorder: '#c49fd8',
  dangerBg: '#fdecea',
  dangerFg: '#7a2020',
  dangerBorder: '#f09090',
} as const;

export const Spacing = {
  sp1: 4,
  sp2: 8,
  sp3: 12,
  sp4: 16,
  sp5: 20,
  sp6: 24,
  sp7: 32,
  sp8: 40,
  sp9: 48,
  sp10: 64,
} as const;

export const Radii = {
  card: 14,
  cardSm: 8,
  pill: 9999,
  tag: 20,
  btn: 12,
  btnSm: 9,
  input: 30,
} as const;

export const Shadows = {
  shadow1: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  shadow3: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 24,
    elevation: 6,
  },
  shadowHeader: {
    shadowColor: '#1c2b1c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
} as const;

export const FontFamily = {
  display: 'Lora_700Bold',
  displayItalic: 'Lora_400Regular_Italic',
  displayRegular: 'Lora_400Regular',
  ui: 'DMSans_400Regular',
  uiMedium: 'DMSans_500Medium',
  uiBold: 'DMSans_700Bold',
  mono: 'Courier',
} as const;
