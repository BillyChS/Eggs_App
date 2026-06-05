export const lightTheme = {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    border: '#E2E8F0',
    textPrimary: '#0F172A',
    textMuted: '#64748B',
    primary: '#1E40AF',     // botón azul navy
    primaryText: '#FFFFFF',
    positive: '#16A34A',    // ganancia
    negative: '#DC2626',    // pérdida
    warning:  '#D97706',    // advertencia
};

export const darkTheme = {
    background: '#0F172A',
    surface: '#1E293B',
    border: '#334155',
    textPrimary: '#F8FAFC',
    textMuted: '#94A3B8',
    primary: '#3B82F6',     // azul más claro para destacar en oscuro
    primaryText: '#FFFFFF',
    positive: '#4ADE80',
    negative: '#F87171',
    warning:  '#FBBF24',
};

export type Theme = typeof lightTheme;