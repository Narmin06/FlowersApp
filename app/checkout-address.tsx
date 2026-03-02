import { useAppStore } from '@/store/useAppStore';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CheckoutAddressScreen() {
    const router = useRouter();
    const addresses = useAppStore(state => state.addresses);
    const isDarkMode = useAppStore(state => state.isDarkMode);
    const setCheckoutAddressId = useAppStore(state => state.setCheckoutAddressId);
    const defaultAddress = addresses.find(a => a.isDefault);
    const [selectedId, setSelectedId] = useState<string | null>(defaultAddress ? defaultAddress.id : null);
    const theme = isDarkMode ? darkTheme : lightTheme;

    const handleNext = () => {
        if (!selectedId) return;
        setCheckoutAddressId(selectedId);
        router.push('/checkout-overview');
    };

    return (
        <SafeAreaView style={[styles.container, theme.container]}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Feather name="arrow-left" size={24} color={theme.text.color} style={{ marginTop: 2 }} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, theme.text]}>Delivery Address</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {addresses.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Feather name="map-pin" size={48} color="#AA949C" />
                        <Text style={[styles.emptyText, theme.text]}>No saved addresses found.</Text>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => router.push('/addresses')}
                        >
                            <Text style={styles.addButtonText}>Add New Address</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        {addresses.map((address) => {
                            const isSelected = selectedId === address.id;
                            return (
                                <TouchableOpacity
                                    key={address.id}
                                    style={[
                                        styles.addressCard,
                                        theme.card,
                                        isSelected && styles.addressCardSelected
                                    ]}
                                    onPress={() => setSelectedId(address.id)}
                                    activeOpacity={0.8}
                                >
                                    <View style={[styles.iconContainer, theme.iconBg]}>
                                        <Feather
                                            name={address.type === 'home' ? 'home' : (address.type === 'briefcase' ? 'briefcase' : 'map-pin')}
                                            size={20}
                                            color={isSelected ? '#AD6D71' : '#AA949C'}
                                        />
                                    </View>
                                    <View style={styles.addressInfo}>
                                        <Text style={[styles.addressTitle, theme.text]}>{address.title}</Text>
                                        <Text style={[styles.addressText, theme.subText]}>{address.address}</Text>
                                    </View>
                                    <View style={styles.radioContainer}>
                                        <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                                            {isSelected && <View style={styles.radioInner} />}
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                        <TouchableOpacity
                            style={[styles.addNewCard, theme.card]}
                            onPress={() => router.push('/addresses')}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.iconContainer, theme.iconBg]}>
                                <Feather name="plus" size={20} color="#AD6D71" />
                            </View>
                            <Text style={[styles.addNewText, theme.text]}>Add New Address</Text>
                        </TouchableOpacity>
                    </>
                )}
            </ScrollView>

            <View style={[styles.footer, theme.card]}>
                <TouchableOpacity
                    style={[styles.button, !selectedId && styles.buttonDisabled]}
                    disabled={!selectedId}
                    onPress={handleNext}
                >
                    <Text style={styles.buttonText}>Next Step</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const darkTheme = StyleSheet.create({
    container: { backgroundColor: '#121212' },
    text: { color: '#FFFFFF' },
    subText: { color: '#A0A0A0' },
    card: { backgroundColor: '#1E1E1E' },
    iconBg: { backgroundColor: '#2A2A2A' },
});

const lightTheme = StyleSheet.create({
    container: { backgroundColor: '#FCF8F9' },
    text: { color: '#150935' },
    subText: { color: '#AA949C' },
    card: { backgroundColor: '#FFFFFF', borderColor: '#F3E9EA', borderWidth: 1 },
    iconBg: { backgroundColor: '#FCF3F5' },
});

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 24,
    },
    backButton: { marginRight: 16 },
    headerTitle: { fontSize: 20, fontWeight: '600' },
    content: { padding: 20 },
    addressCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    addressCardSelected: {
        borderColor: '#AD6D71',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    addressInfo: {
        flex: 1,
    },
    addressTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    addressText: {
        fontSize: 14,
        lineHeight: 20,
    },
    radioContainer: {
        marginLeft: 16,
    },
    radioOuter: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E0CCD0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioOuterSelected: {
        borderColor: '#AD6D71',
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#AD6D71',
    },
    footer: {
        padding: 24,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 10,
    },
    button: {
        backgroundColor: '#AD6D71',
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#E0CCD0',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 64,
    },
    emptyText: {
        fontSize: 16,
        marginTop: 16,
        marginBottom: 24,
    },
    addButton: {
        backgroundColor: '#FCF3F5',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 20,
    },
    addButtonText: {
        color: '#AD6D71',
        fontWeight: '600',
    },
    addNewCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: 'transparent',
        borderStyle: 'dashed',
    },
    addNewText: {
        fontSize: 16,
        fontWeight: '600',
    }
});
