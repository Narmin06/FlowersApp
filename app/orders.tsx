import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ORDERS = [
    {
        id: 'ORD-2023-001',
        date: '21 Feb 2026',
        status: 'Delivered',
        items: 2,
        total: '$85.00',
    },
    {
        id: 'ORD-2023-002',
        date: '14 Feb 2026',
        status: 'Delivered',
        items: 1,
        total: '$50.00',
    },
    {
        id: 'ORD-2023-003',
        date: '10 Jan 2026',
        status: 'Cancelled',
        items: 3,
        total: '$120.00',
    }
];

export default function OrdersScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Feather name="arrow-left" size={24} color="#150935" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Orders</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {ORDERS.map((order) => (
                    <View key={order.id} style={styles.orderCard}>
                        <View style={styles.orderHeader}>
                            <Text style={styles.orderId}>{order.id}</Text>
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
                                <Text style={styles.detailValue}>{order.date}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Items:</Text>
                                <Text style={styles.detailValue}>{order.items}</Text>
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
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

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
        color: '#D1A3A6',
        fontWeight: '700',
    },
    actionButton: {
        borderWidth: 1,
        borderColor: '#D1A3A6',
        borderRadius: 24,
        paddingVertical: 10,
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#D1A3A6',
        fontSize: 14,
        fontWeight: '600',
    },
});
