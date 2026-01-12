/**
 * Chu Precision Health Center - Design System
 * Inline style definitions for consistent, reliable styling across all pages
 */

export const colors = {
    primary: '#2D5A27',
    secondary: '#1F363D',
    accent: '#D4AF37',
    background: '#f5f5f5',
    white: '#ffffff',
    black: '#000000',
    gray: '#666666',
    lightGray: '#e5e7eb',
    green: '#10b981',
    red: '#ef4444',
    blue: '#3b82f6',
    orange: '#f97316',
    teal: '#14b8a6',
    yellow: '#f59e0b',
    primaryTint: '#E8F5E9'
};

export const spacing = {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px'
};

export const fontSize = {
    xs: '10pt',
    sm: '12pt',
    md: '14pt',
    base: '15pt',
    lg: '18pt',
    xl: '20pt',
    xxl: '24pt',
    huge: '30pt'
};

// Reusable style objects
export const styles = {
    // Main container for all pages
    pageContainer: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: spacing.xxl,
        width: '100%',
        padding: spacing.xs
    },

    // Section with border (like header, steps, buttons)
    section: {
        border: '2px solid black',
        borderRadius: '12px',
        backgroundColor: colors.white,
        padding: spacing.lg,
        margin: spacing.xs
    },

    // Section with primary tint background
    sectionPrimary: {
        border: '2px solid black',
        borderRadius: '12px',
        backgroundColor: colors.primaryTint,
        padding: spacing.lg,
        margin: spacing.xs
    },

    // Centered content
    centered: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center'
    },

    // Button styles
    button: {
        padding: `${spacing.sm} ${spacing.lg}`,
        borderRadius: '8px',
        fontWeight: 'bold' as const,
        cursor: 'pointer',
        border: 'none',
        fontSize: fontSize.base
    },

    buttonPrimary: {
        backgroundColor: colors.green,
        color: colors.white
    },

    buttonSecondary: {
        backgroundColor: colors.red,
        color: colors.white
    },

    buttonBlack: {
        backgroundColor: colors.black,
        color: colors.white
    },

    // Input field
    input: {
        fontSize: fontSize.lg,
        padding: spacing.sm,
        border: '2px solid black',
        borderRadius: '8px',
        width: '100%'
    },

    // Text styles
    heading1: {
        fontSize: fontSize.xl,
        fontWeight: 'bold' as const,
        color: colors.secondary,
        margin: 0
    },

    heading2: {
        fontSize: fontSize.lg,
        fontWeight: 'bold' as const,
        color: colors.black,
        margin: 0
    },

    heading3: {
        fontSize: fontSize.base,
        fontWeight: 'bold' as const,
        color: colors.black,
        margin: 0
    },

    bodyText: {
        fontSize: fontSize.base,
        color: colors.black,
        margin: 0
    },

    smallText: {
        fontSize: fontSize.xs,
        color: colors.gray,
        margin: 0,
        fontStyle: 'italic' as const
    },

    // Stat display (like precision score)
    statContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: spacing.sm,
        borderTop: '2px solid black',
        borderBottom: '2px solid black',
        padding: `${spacing.xs} ${spacing.sm}`,
        backgroundColor: colors.white
    },

    statLabel: {
        fontSize: fontSize.lg,
        fontWeight: 'bold' as const,
        textTransform: 'uppercase' as const
    },

    statValue: {
        fontSize: fontSize.lg,
        fontWeight: 'bold' as const
    }
};

// Helper function to merge styles
export const mergeStyles = (...styleObjects: any[]) => {
    return Object.assign({}, ...styleObjects);
};
