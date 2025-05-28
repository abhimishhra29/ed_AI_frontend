import React from 'react';
import {AppProps} from 'next/app';
import {
    ThemeProvider as MuiThemeProvider,
    createTheme,
    CssBaseline,
    responsiveFontSizes,
    PaletteMode
} from '@mui/material';
import '@/styles/globals.css';
import {ThemeProvider as CustomThemeProvider, useTheme} from '@/contexts/ThemeContext';
import {DevSupport} from "@react-buddy/ide-toolbox-next";
import {ComponentPreviews, useInitial} from "@/components/dev";

const createAppTheme = (mode: PaletteMode) => {
    const isLight = mode === 'light';

    return createTheme({
        palette: {
            mode,
            primary: {
                main: '#5b73ff',     // Modern academic blue
                light: '#7c9aff',
                dark: '#4c54f7',
                contrastText: '#ffffff',
            },
            secondary: {
                main: '#d946ef',     // Sophisticated purple accent
                light: '#e879f9',
                dark: '#c026d3',
                contrastText: '#ffffff',
            },
            background: {
                default: isLight ? '#ffffff' : '#0f1419',
                paper: isLight ? '#ffffff' : '#1d2329',
            },
            surface: {
                main: isLight ? '#fafbfc' : '#343b47',
                light: isLight ? '#f4f6f8' : '#4e5969',
                dark: isLight ? '#e8ecf0' : '#1d2329',
            },
            text: {
                primary: isLight ? '#1d2329' : '#f4f6f8',
                secondary: isLight ? '#4e5969' : '#d6dce4',
                disabled: isLight ? '#8a96a3' : '#6b7785',
            },
            error: {
                main: '#ef4444',
                light: '#f87171',
                dark: '#dc2626',
                contrastText: '#ffffff',
            },
            warning: {
                main: '#f59e0b',
                light: '#fbbf24',
                dark: '#d97706',
                contrastText: '#ffffff',
            },
            info: {
                main: '#5b73ff',
                light: '#7c9aff',
                dark: '#4c54f7',
                contrastText: '#ffffff',
            },
            success: {
                main: '#10b981',
                light: '#34d399',
                dark: '#059669',
                contrastText: '#ffffff',
            },
            // Academic grade colors
            grade: {
                a: isLight ? '#059669' : '#34d399',
                b: isLight ? '#10b981' : '#10b981',
                c: isLight ? '#f59e0b' : '#fbbf24',
                d: isLight ? '#d97706' : '#f59e0b',
                f: isLight ? '#ef4444' : '#f87171',
            },
            // Status colors
            status: {
                active: isLight ? '#10b981' : '#34d399',
                pending: isLight ? '#f59e0b' : '#fbbf24',
                inactive: isLight ? '#ef4444' : '#f87171',
            },
            // Neutral palette
            neutral: {
                50: '#fafbfc',
                100: '#f4f6f8',
                200: '#e8ecf0',
                300: '#d6dce4',
                400: '#b0bac7',
                500: '#8a96a3',
                600: '#6b7785',
                700: '#4e5969',
                800: '#343b47',
                900: '#1d2329',
                950: '#0f1419',
            },
        },
        typography: {
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
            fontWeightLight: 300,
            fontWeightRegular: 400,
            fontWeightMedium: 500,
            fontWeightBold: 600,
            h1: {
                fontWeight: 700,
                fontSize: '2.5rem',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                color: isLight ? '#1d2329' : '#f4f6f8',
                marginBottom: '1.5rem',
                fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
            },
            h2: {
                fontWeight: 600,
                fontSize: '2rem',
                lineHeight: 1.25,
                letterSpacing: '-0.02em',
                color: isLight ? '#1d2329' : '#f4f6f8',
                marginBottom: '1.25rem',
                fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
            },
            h3: {
                fontWeight: 600,
                fontSize: '1.5rem',
                lineHeight: 1.3,
                letterSpacing: '-0.01em',
                color: isLight ? '#1d2329' : '#f4f6f8',
                marginBottom: '1rem',
            },
            h4: {
                fontWeight: 600,
                fontSize: '1.25rem',
                lineHeight: 1.4,
                color: isLight ? '#1d2329' : '#f4f6f8',
                marginBottom: '0.875rem',
            },
            h5: {
                fontWeight: 600,
                fontSize: '1.125rem',
                lineHeight: 1.4,
                color: isLight ? '#1d2329' : '#f4f6f8',
                marginBottom: '0.75rem',
            },
            h6: {
                fontWeight: 600,
                fontSize: '1rem',
                lineHeight: 1.5,
                color: isLight ? '#1d2329' : '#f4f6f8',
                marginBottom: '0.75rem',
            },
            subtitle1: {
                fontSize: '1rem',
                fontWeight: 500,
                lineHeight: 1.6,
                color: isLight ? '#4e5969' : '#d6dce4',
                marginBottom: '0.5rem',
            },
            subtitle2: {
                fontSize: '0.875rem',
                fontWeight: 500,
                lineHeight: 1.5,
                color: isLight ? '#6b7785' : '#b0bac7',
                marginBottom: '0.5rem',
            },
            body1: {
                fontSize: '1rem',
                lineHeight: 1.6,
                color: isLight ? '#4e5969' : '#d6dce4',
                marginBottom: '1rem',
            },
            body2: {
                fontSize: '0.875rem',
                lineHeight: 1.6,
                color: isLight ? '#6b7785' : '#b0bac7',
                marginBottom: '0.875rem',
            },
            button: {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.9375rem',
                letterSpacing: '0.01em',
                lineHeight: 1.5,
            },
            caption: {
                fontSize: '0.75rem',
                lineHeight: 1.4,
                color: isLight ? '#8a96a3' : '#8a96a3',
                fontWeight: 400,
            },
            overline: {
                fontSize: '0.75rem',
                lineHeight: 1.4,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: isLight ? '#6b7785' : '#b0bac7',
            },
        },
        shape: {
            borderRadius: 12,
        },
        spacing: 8,
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        padding: '0.75rem 1.5rem',
                        fontSize: '0.9375rem',
                        fontWeight: 500,
                        boxShadow: 'none',
                        textTransform: 'none',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: isLight
                                ? '0 10px 15px -3px rgba(29, 35, 41, 0.08), 0 4px 6px -4px rgba(29, 35, 41, 0.04)'
                                : '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.2)',
                        },
                        '&:active': {
                            transform: 'translateY(0)',
                        },
                    },
                    contained: {
                        boxShadow: isLight
                            ? '0 1px 2px 0 rgba(29, 35, 41, 0.05)'
                            : '0 1px 2px 0 rgba(0, 0, 0, 0.2)',
                        '&:hover': {
                            boxShadow: isLight
                                ? '0 10px 15px -3px rgba(29, 35, 41, 0.12), 0 4px 6px -4px rgba(29, 35, 41, 0.08)'
                                : '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.3)',
                        },
                    },
                    outlined: {
                        borderWidth: '1.5px',
                        backgroundColor: isLight ? 'rgba(91, 115, 255, 0.02)' : 'rgba(91, 115, 255, 0.05)',
                        '&:hover': {
                            borderWidth: '1.5px',
                            backgroundColor: isLight ? 'rgba(91, 115, 255, 0.05)' : 'rgba(91, 115, 255, 0.08)',
                        },
                    },
                    text: {
                        '&:hover': {
                            backgroundColor: isLight ? 'rgba(91, 115, 255, 0.05)' : 'rgba(91, 115, 255, 0.08)',
                        },
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 16,
                        border: `1px solid ${isLight ? '#e8ecf0' : '#4e5969'}`,
                        boxShadow: isLight
                            ? '0 4px 6px -1px rgba(29, 35, 41, 0.08), 0 2px 4px -2px rgba(29, 35, 41, 0.04)'
                            : '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)',
                        overflow: 'hidden',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            borderColor: isLight ? '#d6dce4' : '#6b7785',
                            boxShadow: isLight
                                ? '0 10px 15px -3px rgba(29, 35, 41, 0.12), 0 4px 6px -4px rgba(29, 35, 41, 0.08)'
                                : '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.3)',
                        },
                    },
                },
            },
            MuiCardContent: {
                styleOverrides: {
                    root: {
                        padding: '1.5rem',
                        '&:last-child': {
                            paddingBottom: '1.5rem',
                        },
                    },
                },
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        marginBottom: '1rem',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 8,
                            backgroundColor: isLight ? '#fafbfc' : '#343b47',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '& fieldset': {
                                borderColor: isLight ? '#e8ecf0' : '#4e5969',
                                borderWidth: '1.5px',
                            },
                            '&:hover fieldset': {
                                borderColor: isLight ? '#5b73ff' : '#7c9aff',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: isLight ? '#5b73ff' : '#7c9aff',
                                borderWidth: '2px',
                                boxShadow: isLight
                                    ? '0 0 0 3px rgba(91, 115, 255, 0.12)'
                                    : '0 0 0 3px rgba(91, 115, 255, 0.2)',
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: isLight ? '#6b7785' : '#b0bac7',
                            fontWeight: 500,
                            '&.Mui-focused': {
                                color: isLight ? '#5b73ff' : '#7c9aff',
                            },
                        },
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        borderRadius: 16,
                        border: `1px solid ${isLight ? '#e8ecf0' : '#4e5969'}`,
                        backgroundImage: 'none',
                    },
                    elevation1: {
                        boxShadow: isLight
                            ? '0 4px 6px -1px rgba(29, 35, 41, 0.08), 0 2px 4px -2px rgba(29, 35, 41, 0.04)'
                            : '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)',
                    },
                    elevation4: {
                        boxShadow: isLight
                            ? '0 10px 15px -3px rgba(29, 35, 41, 0.08), 0 4px 6px -4px rgba(29, 35, 41, 0.04)'
                            : '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.2)',
                    },
                },
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        boxShadow: isLight
                            ? '0 1px 2px 0 rgba(29, 35, 41, 0.05)'
                            : '0 1px 2px 0 rgba(0, 0, 0, 0.2)',
                        borderBottom: `1px solid ${isLight ? '#e8ecf0' : '#4e5969'}`,
                        backdropFilter: 'blur(8px)',
                        backgroundColor: isLight
                            ? 'rgba(255, 255, 255, 0.95)'
                            : 'rgba(29, 35, 41, 0.95)',
                    },
                },
            },
            MuiLink: {
                styleOverrides: {
                    root: {
                        textDecoration: 'none',
                        fontWeight: 500,
                        color: isLight ? '#5b73ff' : '#7c9aff',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        borderRadius: 2,
                        '&:hover': {
                            textDecoration: 'underline',
                            textDecorationColor: isLight ? '#4c54f7' : '#7c9aff',
                            textUnderlineOffset: '2px',
                            color: isLight ? '#4c54f7' : '#a4bfff',
                        },
                        '&:focus-visible': {
                            outline: 'none',
                            boxShadow: isLight
                                ? '0 0 0 3px rgba(91, 115, 255, 0.12)'
                                : '0 0 0 3px rgba(91, 115, 255, 0.2)',
                        },
                    },
                },
            },
            MuiListItemButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        margin: '0.25rem 0',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                            backgroundColor: isLight ? 'rgba(91, 115, 255, 0.05)' : 'rgba(91, 115, 255, 0.08)',
                            transform: 'translateX(4px)',
                        },
                        '&.Mui-selected': {
                            backgroundColor: isLight ? 'rgba(91, 115, 255, 0.08)' : 'rgba(91, 115, 255, 0.12)',
                            borderLeft: `3px solid ${isLight ? '#5b73ff' : '#7c9aff'}`,
                            '&:hover': {
                                backgroundColor: isLight ? 'rgba(91, 115, 255, 0.12)' : 'rgba(91, 115, 255, 0.16)',
                            },
                        },
                    },
                },
            },
            MuiTableCell: {
                styleOverrides: {
                    head: {
                        backgroundColor: isLight ? '#f4f6f8' : '#343b47',
                        color: isLight ? '#1d2329' : '#f4f6f8',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        borderBottom: `2px solid ${isLight ? '#e8ecf0' : '#4e5969'}`,
                    },
                    body: {
                        fontSize: '0.9375rem',
                        fontVariantNumeric: 'tabular-nums',
                        borderBottom: `1px solid ${isLight ? '#e8ecf0' : '#4e5969'}`,
                    },
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: {
                        borderRadius: 6,
                        fontWeight: 500,
                        fontSize: '0.8125rem',
                        height: 28,
                    },
                    filled: {
                        '&.MuiChip-colorSuccess': {
                            backgroundColor: isLight ? '#ecfdf5' : 'rgba(16, 185, 129, 0.1)',
                            color: isLight ? '#059669' : '#34d399',
                        },
                        '&.MuiChip-colorWarning': {
                            backgroundColor: isLight ? '#fffbeb' : 'rgba(245, 158, 11, 0.1)',
                            color: isLight ? '#d97706' : '#fbbf24',
                        },
                        '&.MuiChip-colorError': {
                            backgroundColor: isLight ? '#fef2f2' : 'rgba(239, 68, 68, 0.1)',
                            color: isLight ? '#dc2626' : '#f87171',
                        },
                    },
                },
            },
        },
        breakpoints: {
            values: {
                xs: 0,
                sm: 640,
                md: 768,
                lg: 1024,
                xl: 1280,
            },
        },
    });
};

// Enhanced ThemeWrapper component
const ThemeWrapper = ({children}: { children: React.ReactNode }) => {
    const {mode} = useTheme();

    // Create theme based on current mode
    let theme = createAppTheme(mode as PaletteMode);

    // Apply responsive font sizes with custom breakpoints
    theme = responsiveFontSizes(theme, {
        breakpoints: ['sm', 'md', 'lg'],
        disableAlign: false,
        factor: 2,
        variants: [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'subtitle1', 'subtitle2',
            'body1', 'body2',
            'button', 'caption', 'overline'
        ],
    });

    // Set data-theme attribute on document body for CSS custom properties
    React.useEffect(() => {
        document.body.setAttribute('data-theme', mode);
        // Also set on document element for better CSS targeting
        document.documentElement.setAttribute('data-theme', mode);

        // Set theme color for mobile browsers
        const themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (themeColorMeta) {
            themeColorMeta.setAttribute('content', mode === 'light' ? '#ffffff' : '#0f1419');
        }
    }, [mode]);

    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            {children}
        </MuiThemeProvider>
    );
};

function MyApp({Component, pageProps}: AppProps) {
    return (
        <CustomThemeProvider>
            <ThemeWrapper>
                <DevSupport
                    ComponentPreviews={ComponentPreviews}
                    useInitialHook={useInitial}
                >
                    <Component {...pageProps} />
                </DevSupport>
            </ThemeWrapper>
        </CustomThemeProvider>
    );
}

export default MyApp;