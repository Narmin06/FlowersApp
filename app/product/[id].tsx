import { useAppStore } from '@/store/useAppStore';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { height } = Dimensions.get('window');

export default function ProductDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const products = useAppStore(state => state.products);
    const favorites = useAppStore(state => state.favorites);
    const toggleFavorite = useAppStore(state => state.toggleFavorite);
    const addToCart = useAppStore(state => state.addToCart);
    const product = products.find(p => p.id === id);
    const favorite = product ? favorites.includes(product.id) : false;
    const isDarkMode = useAppStore(state => state.isDarkMode);
    const theme = isDarkMode ? darkTheme : lightTheme;

    const [quantity, setQuantity] = useState(1);
    const [userRating, setUserRating] = useState(4);

    if (!product) {
        return (
            <SafeAreaView style={styles.errorContainer}>
                <Text style={styles.errorText}>Product not found!</Text>
                <TouchableOpacity style={styles.backButtonGeneric} onPress={() => router.back()}>
                    <Text style={styles.backButtonGenericText}>Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const handleAddToCart = () => {
        addToCart(product, quantity);
        router.push('/(tabs)/cart');
    };

    return (
        <View style={[styles.container, theme.container]}>
            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>

                <View style={[styles.imageSection, { backgroundColor: isDarkMode ? '#1E1E1E' : '#F3E9EA' }]}>
                    <View style={styles.headerControls}>
                        <TouchableOpacity style={[styles.circleButton, theme.cardBackground]} onPress={() => router.back()} activeOpacity={0.8}>
                            <Feather name="arrow-left" size={20} color={isDarkMode ? '#FFFFFF' : '#150935'} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.circleButton, theme.cardBackground]}
                            onPress={() => toggleFavorite(product.id)}
                            activeOpacity={0.8}
                        >
                            {favorite ? (
                                <FontAwesome name="heart" size={18} color="#FF3B30" />
                            ) : (
                                <Feather name="heart" size={18} color={isDarkMode ? '#FFFFFF' : '#150935'} />
                            )}
                        </TouchableOpacity>
                    </View>

                    <Image source={product.image} style={styles.image} resizeMode="cover" />
                </View>

                <View style={[styles.detailsSection, theme.container]}>
                    <View style={styles.titleRow}>
                        <Text style={[styles.productName, theme.text]}>{product.name}</Text>
                        <Text style={styles.productPrice}>{product.price}</Text>
                    </View>

                    <View style={styles.ratingRow}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity key={star} onPress={() => setUserRating(star)} activeOpacity={0.8}>
                                <FontAwesome
                                    name={star <= userRating ? "star" : "star-o"}
                                    size={20}
                                    color="#FACC15"
                                    style={styles.starFilled}
                                />
                            </TouchableOpacity>
                        ))}
                        <Text style={styles.ratingText}>{userRating}.0 (120 reviews)</Text>
                    </View>

                    <Text style={[styles.sectionTitle, theme.text]}>Description</Text>
                    <Text style={styles.descriptionText}>
                        {product.description || 'A beautiful arrangement of fresh flowers, handpicked and designed uniquely for you.'}
                    </Text>

                    <Text style={[styles.sectionTitle, theme.text]}>Quantity</Text>
                    <View style={[styles.quantityContainer, theme.card, { borderColor: isDarkMode ? '#2A2A2A' : '#F3E9EA' }]}>
                        <TouchableOpacity
                            style={[styles.quantityButton, theme.cardBackground]}
                            onPress={() => setQuantity(Math.max(1, quantity - 1))}
                            activeOpacity={0.7}
                        >
                            <Feather name="minus" size={20} color={isDarkMode ? '#FFFFFF' : '#150935'} />
                        </TouchableOpacity>
                        <Text style={[styles.quantityText, theme.text]}>{quantity}</Text>
                        <TouchableOpacity
                            style={[styles.quantityButton, theme.cardBackground]}
                            onPress={() => setQuantity(quantity + 1)}
                            activeOpacity={0.7}
                        >
                            <Feather name="plus" size={20} color={isDarkMode ? '#FFFFFF' : '#150935'} />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <View style={[styles.footer, theme.card]}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total Price</Text>
                    <Text style={[styles.totalPrice, theme.text]}>{Math.round(parseFloat(product.price.replace(/[^0-9.]/g, '')) * quantity)} AZN</Text>
                </View>
                <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart} activeOpacity={0.8}>
                    <Text style={styles.addToCartButtonText}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const darkTheme = StyleSheet.create({
    container: { backgroundColor: '#121212' },
    text: { color: '#FFFFFF' },
    subText: { color: '#A0A0A0' },
    card: { backgroundColor: '#1E1E1E' },
    cardBackground: { backgroundColor: '#2A2A2A', shadowOpacity: 0 },
});

const lightTheme = StyleSheet.create({
    container: { backgroundColor: '#FCF8F9' },
    text: { color: '#150935' },
    subText: { color: '#AA949C' },
    card: { backgroundColor: '#FFFFFF' },
    cardBackground: { backgroundColor: '#FFFFFF' },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FCF8F9',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        color: '#D85C66',
        marginBottom: 20,
    },
    backButtonGeneric: {
        padding: 12,
        backgroundColor: '#AD6D71',
        borderRadius: 8,
    },
    backButtonGenericText: {
        color: '#FFF',
        fontWeight: '600',
    },
    imageSection: {
        width: '100%',
        height: height * 0.5,
        paddingTop: 0,
    },
    image: {
        width: '100%',
        flex: 1,
    },
    headerControls: {
        position: 'absolute',
        top: 25,
        left: 0,
        right: 0,
        zIndex: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    circleButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    heartActive: {
        // Handled directly via color prop in element
    },
    detailsSection: {
        backgroundColor: '#FCF8F9',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        marginTop: -32,
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 140, // accommodate footer
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    productName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#150935',
        flex: 1,
        marginRight: 16,
    },
    productPrice: {
        fontSize: 24,
        fontWeight: '700',
        color: '#AD6D71',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    starFilled: {
        marginRight: 4,
    },
    ratingText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#AA949C',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#150935',
        marginBottom: 12,
        marginTop: 8,
    },
    descriptionText: {
        fontSize: 15,
        color: '#AA949C',
        lineHeight: 24,
        marginBottom: 24,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: '#F3E9EA',
    },
    quantityButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FCF3F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#150935',
        marginHorizontal: 24,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 24,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    totalContainer: {
        justifyContent: 'center',
    },
    totalLabel: {
        fontSize: 13,
        color: '#AA949C',
        marginBottom: 4,
    },
    totalPrice: {
        fontSize: 22,
        fontWeight: '700',
        color: '#150935',
    },
    addToCartButton: {
        backgroundColor: '#AD6D71',
        borderRadius: 25,
        height: 50,
        paddingHorizontal: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addToCartButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
