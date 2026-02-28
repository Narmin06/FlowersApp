import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useAppStore } from '@/store/useAppStore';

export default function OrdersScreen() {
    const router = useRouter();
    const orders = useAppStore(state => state.orders);
    const setOrders = useAppStore(state => state.setOrders);
    const isDarkMode = useAppStore(state => state.isDarkMode);
    const theme = isDarkMode ? darkTheme : lightTheme;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const dataStr = await AsyncStorage.getItem('userData');
                if (dataStr) {
                    const data = JSON.parse(dataStr);
                    if (data.orders) {
                        setOrders(data.orders);
                    }
                }
            } catch (error) {
                console.error('Error fetching orders from storage:', error);
            }
        };
        fetchOrders();
    }, []);

    return (
        <SafeAreaView style={[styles.container, theme.container]}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Feather name="arrow-left" size={24} color={isDarkMode ? '#FFFFFF' : '#150935'} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, theme.text]}>My Orders</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {orders.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Feather name="package" size={64} color={isDarkMode ? '#2A2A2A' : '#F3E9EA'} style={styles.emptyIcon} />
                        <Text style={[styles.emptyTitle, theme.text]}>No Orders Yet</Text>
                        <Text style={styles.emptySubtitle}>You haven't placed any orders. Start checking out fresh flowers!</Text>
                        <TouchableOpacity style={styles.shopButton} onPress={() => router.replace('/(tabs)')} activeOpacity={0.8}>
                            <Text style={styles.shopButtonText}>Start Shopping</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    orders.map((order) => (
                        <View key={order.id} style={[styles.orderCard, theme.card]}>
                            <View style={[styles.orderHeader, theme.borderBottom]}>
                                <Text style={[styles.orderId, theme.text]}>{order.id}</Text>
                                <View style={[
                                    styles.statusBadge,
                                    order.status === 'Delivered' ? styles.statusDelivered : styles.statusCancelled
                                ]}>
                                    <Text style={[
                                        styles.statusText,
                                        order.status === 'Delivered' ? styles.statusTextDelivered : styles.statusTextCancelled
                                    ]}>{order.status}</Text>
                                </View>
                            </View>

                            <View style={styles.orderDetails}>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Date:</Text>
                                    <Text style={[styles.detailValue, theme.text]}>{order.date}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Items:</Text>
                                    <Text style={[styles.detailValue, theme.text]}>{order.items}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Total Amount:</Text>
                                    <Text style={styles.detailTotal}>{order.total}</Text>
                                </View>
                            </View>

                            <TouchableOpacity style={styles.actionButton}>
                                <Text style={styles.actionButtonText}>
                                    {order.status === 'Delivered' ? 'Reorder' : 'View Details'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const darkTheme = StyleSheet.create({
    container: { backgroundColor: '#121212' },
    card: { backgroundColor: '#1E1E1E', shadowOpacity: 0 },
    text: { color: '#FFFFFF' },
    borderBottom: { borderBottomColor: '#2A2A2A' },
});

const lightTheme = StyleSheet.create({
    container: { backgroundColor: '#FCF8F9' },
    card: { backgroundColor: '#FFFFFF' },
    text: { color: '#150935' },
    borderBottom: { borderBottomColor: '#F3E9EA' },
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
        padding: 4,
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
    orderCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3E9EA',
    },
    orderId: {
        fontSize: 16,
        fontWeight: '600',
        color: '#150935',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusDelivered: {
        backgroundColor: '#E8F5E9',
    },
    statusCancelled: {
        backgroundColor: '#FFEBEE',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    statusTextDelivered: {
        color: '#2E7D32',
    },
    statusTextCancelled: {
        color: '#C62828',
    },
    orderDetails: {
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 14,
        color: '#AA949C',
    },
    detailValue: {
        fontSize: 14,
        color: '#150935',
        fontWeight: '500',
    },
    detailTotal: {
        fontSize: 14,
        color: '#AD6D71',
        fontWeight: '700',
    },
    actionButton: {
        borderWidth: 1,
        borderColor: '#AD6D71',
        borderRadius: 24,
        paddingVertical: 10,
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#AD6D71',
        fontSize: 14,
        fontWeight: '600',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
    },
    emptyIcon: {
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#150935',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 15,
        color: '#AA949C',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    shopButton: {
        backgroundColor: '#AD6D71',
        paddingHorizontal: 32,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    shopButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
