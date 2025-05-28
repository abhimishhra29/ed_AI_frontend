// src/types/theme.d.ts
import '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Palette {
        surface: {
            main: string;
            light: string;
            dark: string;
        };
        grade: {
            a: string;
            b: string;
            c: string;
            d: string;
            f: string;
        };
        status: {
            active: string;
            pending: string;
            inactive: string;
        };
        neutral: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
            950: string;
        };
    }
    interface PaletteOptions {
        surface?: Palette['surface'];
        grade?: Palette['grade'];
        status?: Palette['status'];
        neutral?: Palette['neutral'];
    }
}