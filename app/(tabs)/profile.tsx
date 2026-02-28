import { useAppStore } from '@/store/useAppStore';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
    const router = useRouter();
    const userName = useAppStore(state => state.userName);
    const userEmail = useAppStore(state => state.userEmail);
    const isDarkMode = useAppStore(state => state.isDarkMode);

    const theme = isDarkMode ? darkTheme : lightTheme;

    const handleLogout = () => {
        // Navigate back to sign in
        router.replace('/sign-in');
    };

    return (
        <SafeAreaView style={[styles.container, theme.container]}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, theme.text]}>Profile</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* User Info Card */}
                <View style={[styles.userCard, theme.card]}>
                    <View style={styles.avatarContainer}>
                        <Feather name="user" size={32} color="#AD6D71" />
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={[styles.userName, theme.text]}>{userName}</Text>
                        <Text style={[styles.userEmail, theme.subText]}>{userEmail}</Text>
                    </View>
                </View>

                {/* Menu Items */}
                <TouchableOpacity style={[styles.menuItem, theme.card]} activeOpacity={0.7} onPress={() => router.push('/orders' as any)}>
                    <View style={[styles.iconContainer, theme.cardBackground]}>
                        <Feather name="shopping-bag" size={20} color="#AD6D71" />
                    </View>
                    <View style={styles.menuItemTextContainer}>
                        <Text style={[styles.menuItemTitle, theme.text]}>My Orders</Text>
                        <Text style={[styles.menuItemSubtitle, theme.subText]}>View your order history</Text>
                    </View>
                    <Feather name="chevron-right" size={20} color={isDarkMode ? '#A0A0A0' : '#AA949C'} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.menuItem, theme.card]} activeOpacity={0.7} onPress={() => router.push('/addresses' as any)}>
                    <View style={[styles.iconContainer, theme.cardBackground]}>
                        <Feather name="map-pin" size={20} color="#AD6D71" />
                    </View>
                    <View style={styles.menuItemTextContainer}>
                        <Text style={[styles.menuItemTitle, theme.text]}>Addresses</Text>
                        <Text style={[styles.menuItemSubtitle, theme.subText]}>Manage delivery addresses</Text>
                    </View>
                    <Feather name="chevron-right" size={20} color={isDarkMode ? '#A0A0A0' : '#AA949C'} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.menuItem, theme.card]} activeOpacity={0.7} onPress={() => router.push('/settings' as any)}>
                    <View style={[styles.iconContainer, theme.cardBackground]}>
                        <Feather name="settings" size={20} color="#AD6D71" />
                    </View>
                    <View style={styles.menuItemTextContainer}>
                        <Text style={[styles.menuItemTitle, theme.text]}>Settings</Text>
                        <Text style={[styles.menuItemSubtitle, theme.subText]}>App preferences</Text>
                    </View>
                    <Feather name="chevron-right" size={20} color={isDarkMode ? '#A0A0A0' : '#AA949C'} />
                </TouchableOpacity>

                {/* Logout Item */}
                <TouchableOpacity style={[styles.menuItem, styles.logoutItem, theme.card, { borderColor: isDarkMode ? '#2A2A2A' : '#FFF0F1' }]} activeOpacity={0.7} onPress={handleLogout}>
                    <View style={[styles.iconContainer, styles.logoutIconContainer]}>
                        <Feather name="log-out" size={20} color="#D85C66" />
                    </View>
                    <View style={styles.menuItemTextContainer}>
                        <Text style={styles.logoutTitle}>Logout</Text>
                        <Text style={[styles.menuItemSubtitle, theme.subText]}>Sign out of your account</Text>
                    </View>
                </TouchableOpacity>


            </ScrollView>

        </SafeAreaView>
    );
}

const darkTheme = StyleSheet.create({
    container: { backgroundColor: '#121212' },
    text: { color: '#FFFFFF' },
    subText: { color: '#A0A0A0' },
    card: { backgroundColor: '#1E1E1E' },
    cardBackground: { backgroundColor: '#2A2A2A' },
});

const lightTheme = StyleSheet.create({
    container: { backgroundColor: '#FCF8F9' },
    text: { color: '#150935' },
    subText: { color: '#AA949C' },
    card: { backgroundColor: '#FFFFFF' },
    cardBackground: { backgroundColor: '#F3E9EA' },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FCF8F9',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 24,
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#150935',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F3E4FC', // Light purple
        justifyContent: 'center',
        alignItems: 'center',
    },
    userInfo: {
        marginLeft: 16,
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#150935',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#AA949C',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 8,
        elevation: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FCF3F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuItemTextContainer: {
        flex: 1,
        marginLeft: 16,
    },
    menuItemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#150935',
        marginBottom: 2,
    },
    menuItemSubtitle: {
        fontSize: 13,
        color: '#AA949C',
    },
    logoutItem: {
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#FFF0F1',
    },
    logoutIconContainer: {
        backgroundColor: '#FFF0F1',
    },
    logoutTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#D85C66', // Reddish color for logout
        marginBottom: 2,
    },
    footer: {
        alignItems: 'center',
        marginTop: 40,
    },
    footerText: {
        fontSize: 12,
        color: '#AA949C',
        marginBottom: 4,
    },
});
