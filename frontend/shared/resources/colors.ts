type CssVariableMap = Record<string, string>;

export const POCKET_PILOT_COLOR_VALUES = {
	primary: '#5b9279',
	secondary: '#0b4650',
	tertiary: '#c6ff33',
	quaternary: '#fe7f2d',
	transparent: 'transparent',
	loaderPrimary: 'rgba(91, 146, 121, 50%)',
	scrollbarTrack: 'rgb(91, 146, 121, 25%)',
	loaderSecondary: 'rgba(254, 127, 45, 50%)',
	
	success: '#22c55d',
	warning: '#fbbf24',
	error: '#fa2c05',
	info: '#009cbc',
	
	dark: '#101011',
	black: '#000000',
	gray1: '#2b2b2c',
	gray2: '#606266',
	mirage: '#16232a',
	pitchBlack: '#0a0903',
	darkCardBg: '#233d4d',
	tertiaryDark: '#898a8d',
	
	gray3: '#a7a7a7',
	gray4: '#d9d9d9',
	white: '#ffffff',
	wildSand: '#e4eef0',
	mildWhite: '#f3f4f6',
	lightCardBg: '#e8d8c9',
	tertiaryWhite: '#f9f7f2',
	alternateWhite: '#f0f2f6',
	
	jetBlack: '#272d2d',
	jungleTeal: '#5b9279',
	torchRed: '#fb2b37',
	malachite: '#00c951',
	burgundy: '#88292f',
	emerald: '#7ebc89',
	spicyPaprika: '#ec4e20',
	redEmerald: '#e53935',
	appleRed: '#ff3b30',
	overlayBackground: 'rgba(0, 0, 0, 0.65)'
} as const;

export const POCKET_PILOT_ROOT_COLOR_VARIABLES: CssVariableMap = {
	primary: POCKET_PILOT_COLOR_VALUES.primary,
	secondary: POCKET_PILOT_COLOR_VALUES.secondary,
	tertiary: POCKET_PILOT_COLOR_VALUES.tertiary,
	quaternary: POCKET_PILOT_COLOR_VALUES.quaternary,
	transparent: POCKET_PILOT_COLOR_VALUES.transparent,
	'loader-primary': POCKET_PILOT_COLOR_VALUES.loaderPrimary,
	'scrollbar-track': POCKET_PILOT_COLOR_VALUES.scrollbarTrack,
	'loader-secondary': POCKET_PILOT_COLOR_VALUES.loaderSecondary,
	
	success: POCKET_PILOT_COLOR_VALUES.success,
	warning: POCKET_PILOT_COLOR_VALUES.warning,
	error: POCKET_PILOT_COLOR_VALUES.error,
	danger: 'var(--error)',
	info: POCKET_PILOT_COLOR_VALUES.info,
	income: 'var(--emerald)',
	expense: 'var(--apple-red)',
	transfer: 'var(--quaternary)',
	
	dark: POCKET_PILOT_COLOR_VALUES.dark,
	black: POCKET_PILOT_COLOR_VALUES.black,
	gray1: POCKET_PILOT_COLOR_VALUES.gray1,
	gray2: POCKET_PILOT_COLOR_VALUES.gray2,
	mirage: POCKET_PILOT_COLOR_VALUES.mirage,
	'pitch-black': POCKET_PILOT_COLOR_VALUES.pitchBlack,
	'dark-card-bg': POCKET_PILOT_COLOR_VALUES.darkCardBg,
	'tertiary-dark': POCKET_PILOT_COLOR_VALUES.tertiaryDark,
	
	gray3: POCKET_PILOT_COLOR_VALUES.gray3,
	gray4: POCKET_PILOT_COLOR_VALUES.gray4,
	white: POCKET_PILOT_COLOR_VALUES.white,
	'wild-sand': POCKET_PILOT_COLOR_VALUES.wildSand,
	'mild-white': POCKET_PILOT_COLOR_VALUES.mildWhite,
	'light-card-bg': POCKET_PILOT_COLOR_VALUES.lightCardBg,
	'tertiary-white': POCKET_PILOT_COLOR_VALUES.tertiaryWhite,
	'alternate-white': POCKET_PILOT_COLOR_VALUES.alternateWhite,
	
	'jet-black': POCKET_PILOT_COLOR_VALUES.jetBlack,
	'jungle-teal': POCKET_PILOT_COLOR_VALUES.jungleTeal,
	'torch-red': POCKET_PILOT_COLOR_VALUES.torchRed,
	malachite: POCKET_PILOT_COLOR_VALUES.malachite,
	burgundy: POCKET_PILOT_COLOR_VALUES.burgundy,
	emerald: POCKET_PILOT_COLOR_VALUES.emerald,
	'spicy-paprika': POCKET_PILOT_COLOR_VALUES.spicyPaprika,
	'red-emerald': POCKET_PILOT_COLOR_VALUES.redEmerald,
	'apple-red': POCKET_PILOT_COLOR_VALUES.appleRed,
	
	'body-background': 'var(--white)',
	'inverted-background': 'var(--dark)',
	'alternate-background': 'var(--gray3)',
	muted: 'var(--gray4)',
	'muted-text': 'var(--gray2)',
	'primary-text': 'var(--dark)',
	'inverted-text': 'var(--white)',
	'alternate-text': 'var(--gray1)',
	'reactive-text': 'var(--muted-text)',
	background: 'var(--body-background)',
	'text-secondary': 'var(--muted-text)',
	'overlay-background': POCKET_PILOT_COLOR_VALUES.overlayBackground
};

export const POCKET_PILOT_LIGHT_COLOR_VARIABLES: CssVariableMap = {
	'body-background': 'var(--alternate-white)',
	'alternate-background': 'var(--white)',
	'inverted-background': 'var(--dark)',
	'primary-text': 'var(--dark)',
	'inverted-text': 'var(--white)',
	'alternate-text': 'var(--gray1)',
	'muted-text': 'var(--gray2)',
	'reactive-text': 'var(--muted-text)',
	background: 'var(--body-background)',
	'text-secondary': 'var(--muted-text)'
};

export const POCKET_PILOT_DARK_COLOR_VARIABLES: CssVariableMap = {
	'body-background': 'var(--dark)',
	'alternate-background': 'var(--gray1)',
	'inverted-background': 'var(--mild-white)',
	'primary-text': 'var(--white)',
	'inverted-text': 'var(--black)',
	'alternate-text': 'var(--gray4)',
	'muted-text': 'var(--gray2)',
	'reactive-text': 'var(--tertiary-dark)',
	background: 'var(--body-background)',
	'text-secondary': 'var(--reactive-text)'
};

export const POCKET_PILOT_TAILWIND_COLOR_VARIABLES: CssVariableMap = {
	primary: 'var(--primary)',
	secondary: 'var(--secondary)',
	tertiary: 'var(--tertiary)',
	quaternary: 'var(--quaternary)',
	transparent: 'var(--transparent)',
	
	'loader-primary': 'var(--loader-primary)',
	'scrollbar-track': 'var(--scrollbar-track)',
	'loader-secondary': 'var(--loader-secondary)',
	
	success: 'var(--success)',
	warning: 'var(--warning)',
	error: 'var(--error)',
	danger: 'var(--danger)',
	info: 'var(--info)',
	muted: 'var(--muted)',
	income: 'var(--income)',
	expense: 'var(--expense)',
	transfer: 'var(--transfer)',
	'tertiary-dark': 'var(--tertiary-dark)',
	
	dark: 'var(--dark)',
	black: 'var(--black)',
	gray1: 'var(--gray1)',
	gray2: 'var(--gray2)',
	gray3: 'var(--gray3)',
	gray4: 'var(--gray4)',
	white: 'var(--white)',
	'wild-sand': 'var(--wild-sand)',
	'mild-white': 'var(--mild-white)',
	'alternate-white': 'var(--alternate-white)',
	
	'muted-text': 'var(--muted-text)',
	'primary-text': 'var(--primary-text)',
	'inverted-text': 'var(--inverted-text)',
	'reactive-text': 'var(--reactive-text)',
	'alternate-text': 'var(--alternate-text)',
	'body-background': 'var(--body-background)',
	'inverted-background': 'var(--inverted-background)',
	'alternate-background': 'var(--alternate-background)',
	background: 'var(--background)',
	'text-secondary': 'var(--text-secondary)',
	'overlay-background': 'var(--overlay-background)'
};

export const POCKET_PILOT_NATIVE_COLORS = {
	light: {
		text: POCKET_PILOT_COLOR_VALUES.dark,
		background: POCKET_PILOT_COLOR_VALUES.alternateWhite,
		backgroundElement: POCKET_PILOT_COLOR_VALUES.white,
		backgroundSelected: POCKET_PILOT_COLOR_VALUES.gray4,
		textSecondary: POCKET_PILOT_COLOR_VALUES.gray2
	},
	dark: {
		text: POCKET_PILOT_COLOR_VALUES.white,
		background: POCKET_PILOT_COLOR_VALUES.dark,
		backgroundElement: POCKET_PILOT_COLOR_VALUES.gray1,
		backgroundSelected: POCKET_PILOT_COLOR_VALUES.gray2,
		textSecondary: POCKET_PILOT_COLOR_VALUES.tertiaryDark
	}
} as const;

const formatCssVariables = (variables: CssVariableMap, indent = '    ') =>
	Object.entries(variables)
		.map(([name, value]) => `${indent}--${name}: ${value};`)
		.join('\n');

const formatThemeVariables = (variables: CssVariableMap, indent = '    ') =>
	Object.entries(variables)
		.map(([name, value]) => `${indent}--color-${name}: ${value};`)
		.join('\n');

const cssVariableBlock = (selector: string, variables: CssVariableMap, colorScheme?: 'light' | 'dark') => {
	const colorSchemeDeclaration = colorScheme ? `    color-scheme: ${colorScheme};\n` : '';
	return `${selector} {\n${colorSchemeDeclaration}${formatCssVariables(variables)}\n}`;
};

const systemPreferenceBlock = (preference: 'light' | 'dark', variables: CssVariableMap) => {
	const declarations = [`        color-scheme: ${preference};`, formatCssVariables(variables, '        ')];
	return `@media (prefers-color-scheme: ${preference}) {\n    :root:not(.light):not(.dark) {\n${declarations.join('\n')}\n    }\n}`;
};

export const buildPocketPilotWebColorCss = () =>
	[
		'/* This file is generated from frontend/shared/colors.ts. */',
		'/* Run `npm run generate:colors` after changing shared color tokens. */',
		cssVariableBlock(':root', POCKET_PILOT_ROOT_COLOR_VARIABLES),
		cssVariableBlock(':root.light', POCKET_PILOT_LIGHT_COLOR_VARIABLES, 'light'),
		cssVariableBlock(':root.dark', POCKET_PILOT_DARK_COLOR_VARIABLES, 'dark'),
		systemPreferenceBlock('light', POCKET_PILOT_LIGHT_COLOR_VARIABLES),
		systemPreferenceBlock('dark', POCKET_PILOT_DARK_COLOR_VARIABLES),
		`@theme inline {\n${formatThemeVariables(POCKET_PILOT_TAILWIND_COLOR_VARIABLES)}\n}`
	].join('\n\n') + '\n';

export const buildPocketPilotMobileGlobalCss = () =>
	[
		[
			'@import "tailwindcss/theme.css" layer(theme);',
			'@import "tailwindcss/preflight.css" layer(base);',
			'@import "tailwindcss/utilities.css";',
			'@import "nativewind/theme";'
		].join('\n'),
		'/* This file is generated from frontend/shared/colors.ts. */',
		'/* Run `npm run generate:colors` after changing shared color tokens. */',
		`@theme {\n${formatThemeVariables(POCKET_PILOT_TAILWIND_COLOR_VARIABLES)}\n}`,
		cssVariableBlock(':root', POCKET_PILOT_ROOT_COLOR_VARIABLES),
		cssVariableBlock(':root.light', POCKET_PILOT_LIGHT_COLOR_VARIABLES, 'light'),
		cssVariableBlock(':root.dark', POCKET_PILOT_DARK_COLOR_VARIABLES, 'dark'),
		systemPreferenceBlock('light', POCKET_PILOT_LIGHT_COLOR_VARIABLES),
		systemPreferenceBlock('dark', POCKET_PILOT_DARK_COLOR_VARIABLES),
		`:root {\n    --font-display: Spline Sans, Inter, ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;\n    --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace;\n    --font-rounded: 'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif;\n    --font-serif: Georgia, 'Times New Roman', serif;\n}`
	].join('\n\n') + '\n';
