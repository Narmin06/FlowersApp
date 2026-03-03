import { useColorScheme } from 'react-native';

export default function useTheme() {
    const isDark = useColorScheme() === 'dark';

    return {
        isDark,
        colors: {
            text: isDark ? '#FFFFFF' : '#150935',
            background: isDark ? '#1A1A1A' : '#FCF8F9',
            secondBackground: isDark ? '#2A2A2A' : '#FFFFFF',
            inputBg: isDark ? '#2A2A2A' : '#FCF3F5',
            inputBorder: isDark ? '#3A3A3A' : '#F3E9EA',
            icon: isDark ? '#888888' : '#AA949C',
            error: isDark ? '#FF6B6B' : '#FF3B30',
            primary: isDark ? '#D9898E' : '#AD6D71',
            buttonText: isDark ? '#FFFFFF' : '#FFFFFF',
        }
    };
}
