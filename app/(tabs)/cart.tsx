import { useAppStore } from '@/store/useAppStore';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CartScreen() {
    const router = useRouter();
    const cartItems = useAppStore(state => state.cart);
    const updateQuantity = useAppStore(state => state.updateCartQuantity);
    const removeItem = useAppStore(state => state.removeFromCart);
    const clearCart = useAppStore(state => state.clearCart);
    const addOrder = useAppStore(state => state.addOrder);
    const isDarkMode = useAppStore(state => state.isDarkMode);

    const theme = isDarkMode ? darkTheme : lightTheme;

    const handleCheckoutPress = () => {
        router.push('/checkout-date');
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price.replace('$', '')) * item.quantity), 0);
    const delivery = subtotal > 0 ? 5.00 : 0.00;
    const total = subtotal + delivery;

    return (
        <SafeAreaView style={[styles.container, theme.container]}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/(tabs)')}>
                    <Feather name="arrow-left" size={24} color={isDarkMode ? '#FFFFFF' : '#150935'} style={{ marginTop: 2 }} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, theme.text]}>My Cart</Text>
            </View>

            {cartItems.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Feather name="shopping-bag" size={64} color={isDarkMode ? '#2A2A2A' : '#F3E9EA'} style={styles.emptyIcon} />
                    <Text style={[styles.emptyTitle, theme.text]}>Your Cart is Empty</Text>
                    <Text style={[styles.emptySubtitle, theme.subText]}>
                        Looks like you haven't added anything to your cart yet.
                    </Text>
                    <TouchableOpacity
                        style={styles.exploreButton}
                        onPress={() => router.push('/(tabs)')}
                    >
                        <Text style={styles.exploreButtonText}>Explore Flowers</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {cartItems.map((item) => (
                        <View key={item.id} style={[styles.cartItem, theme.card]}>
                            <View style={[styles.imageContainer, theme.cardBackground]}>
                                <Image source={item.image} style={styles.itemImage} resizeMode="contain" />
                            </View>

                            <View style={styles.itemDetails}>
                                <View style={styles.itemHeader}>
                                    <Text style={[styles.itemName, theme.text]} numberOfLines={1}>{item.name}</Text>
                                    <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.deleteButton}>
                                        <Feather name="trash-2" size={18} color="#D85C66" />
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.itemPrice}>{item.price}</Text>

                                <View style={[styles.quantityContainer, { borderColor: isDarkMode ? '#2A2A2A' : '#F3E9EA' }]}>
                                    <TouchableOpacity
                                        style={[styles.quantityButton, { backgroundColor: isDarkMode ? '#2A2A2A' : '#FCF3F5' }]}
                                        onPress={() => updateQuantity(item.id, -1)}
                                        activeOpacity={0.7}
                                    >
                                        <Feather name="minus" size={16} color={isDarkMode ? '#FFFFFF' : '#150935'} />
                                    </TouchableOpacity>
                                    <Text style={[styles.quantityText, theme.text]}>{item.quantity}</Text>
                                    <TouchableOpacity
                                        style={[styles.quantityButton, { backgroundColor: isDarkMode ? '#2A2A2A' : '#FCF3F5' }]}
                                        onPress={() => updateQuantity(item.id, 1)}
                                        activeOpacity={0.7}
                                    >
                                        <Feather name="plus" size={16} color={isDarkMode ? '#FFFFFF' : '#150935'} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            )}

            {cartItems.length > 0 && (
                <View style={[styles.footer, theme.card]}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Subtotal</Text>
                        <Text style={[styles.summaryValue, theme.text]}>{Math.round(subtotal)} AZN</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Delivery</Text>
                        <Text style={[styles.summaryValue, theme.text]}>{Math.round(delivery)} AZN</Text>
                    </View>
                    <View style={[styles.divider, theme.divider]} />
                    <View style={[styles.summaryRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={[styles.totalValue, theme.text]}>{Math.round(total)} AZN</Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.checkoutButton, cartItems.length === 0 && styles.checkoutButtonDisabled]}
                        activeOpacity={0.8}
                        disabled={cartItems.length === 0}
                        onPress={handleCheckoutPress}
                    >
                        <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

const darkTheme = StyleSheet.create({
    container: { backgroundColor: '#121212' },
    text: { color: '#FFFFFF' },
    subText: { color: '#A0A0A0' },
    card: { backgroundColor: '#1E1E1E' },
    cardBackground: { backgroundColor: '#2A2A2A' },
    divider: { backgroundColor: '#2A2A2A' },
});

const lightTheme = StyleSheet.create({
    container: { backgroundColor: '#FCF8F9' },
    text: { color: '#150935' },
    subText: { color: '#AA949C' },
    card: { backgroundColor: '#FFFFFF' },
    cardBackground: { backgroundColor: '#F3E9EA' },
    divider: { backgroundColor: '#F3E9EA' },
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
        paddingBottom: 20,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    itemImage: {
        width: '100%',
        height: '100%',
    },
    imageContainer: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: '#F3E9EA',
        overflow: 'hidden',
    },
    itemDetails: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    itemName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#150935',
        flex: 1,
        marginRight: 8,
    },
    deleteButton: {
        padding: 4,
    },
    itemPrice: {
        fontSize: 14,
        color: '#AD6D71',
        fontWeight: '600',
        marginTop: 4,
        marginBottom: 8,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#FCF3F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#150935',
        marginHorizontal: 16,
    },
    footer: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 32,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 10,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#AA949C',
    },
    summaryValue: {
        fontSize: 14,
        color: '#AA949C',
        fontWeight: '500',
    },
    totalRow: {
        marginTop: 8,
        marginBottom: 24,
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 16,
        color: '#150935',
        fontWeight: '600',
    },
    totalValue: {
        fontSize: 18,
        color: '#AD6D71',
        fontWeight: '600',
    },
    checkoutButton: {
        backgroundColor: '#AD6D71',
        borderRadius: 28,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkoutButtonDisabled: {
        backgroundColor: '#E0CCD0',
    },
    checkoutButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 40,
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#150935',
    },
    closeModalButton: {
        padding: 4,
    },
    modalForm: {
        paddingBottom: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#150935',
        marginBottom: 8,
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FCF3F5',
        borderWidth: 1,
        borderColor: '#F3E9EA',
        borderRadius: 16,
        height: 56,
        paddingHorizontal: 16,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#150935',
        height: '100%',
    },
    rowInputs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalTotalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3E9EA',
    },
    modalTotalText: {
        fontSize: 16,
        color: '#AA949C',
        fontWeight: '500',
    },
    modalTotalAmount: {
        fontSize: 24,
        color: '#150935',
        fontWeight: '700',
    },
    payButton: {
        backgroundColor: '#AD6D71',
        borderRadius: 28,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    payButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyIcon: {
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#150935',
        marginBottom: 12,
    },
    emptySubtitle: {
        fontSize: 15,
        color: '#AA949C',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
    },
    exploreButton: {
        backgroundColor: '#AD6D71',
        paddingHorizontal: 32,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    exploreButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3E9EA',
        marginVertical: 16,
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: 6,
        marginLeft: 4,
    },
});
