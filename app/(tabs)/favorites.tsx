import { useAppStore } from '@/store/useAppStore';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function FavoritesScreen() {
    const router = useRouter();
    const storeProducts = useAppStore(state => state.products);
    const favoriteIds = useAppStore(state => state.favorites);
    const toggleFavorite = useAppStore(state => state.toggleFavorite);
    const isDarkMode = useAppStore(state => state.isDarkMode);

    const theme = isDarkMode ? darkTheme : lightTheme;

    const favoriteProducts = storeProducts.filter(p => favoriteIds.includes(p.id));

    const renderItem = ({ item }: { item: any }) => {
        const favorite = favoriteIds.includes(item.id);
        return (
            <TouchableOpacity
                style={styles.productCard}
                activeOpacity={0.9}
                onPress={() => router.push(`/product/${item.id}` as any)}
            >
                <View style={[styles.imageContainer, theme.cardBackground]}>
                    <Image source={item.image} style={styles.productImage} resizeMode="contain" />
                    <TouchableOpacity
                        style={[styles.favoriteButton, theme.card]}
                        activeOpacity={0.8}
                        onPress={() => toggleFavorite(item.id)}
                    >
                        {favorite ? (
                            <FontAwesome name="heart" size={14} color="#FF3B30" />
                        ) : (
                            <Feather name="heart" size={14} color={isDarkMode ? '#A0A0A0' : '#AA949C'} />
                        )}
                    </TouchableOpacity>
                </View>
                <View style={styles.productInfo}>
                    <View style={styles.deliveryRow}>
                        <Feather name="truck" size={12} color="#1F9939" />
                        <Text style={styles.deliveryText}>Free delivery</Text>
                    </View>
                    <Text style={[styles.productName, theme.text]} numberOfLines={2}>{item.name}</Text>

                    <View style={styles.ratingRow}>
                        <FontAwesome name="star" size={10} color="#FACC15" />
                        <FontAwesome name="star" size={10} color="#FACC15" />
                        <FontAwesome name="star" size={10} color="#FACC15" />
                        <FontAwesome name="star" size={10} color="#FACC15" />
                        <FontAwesome name="star-half-empty" size={10} color="#FACC15" />
                        <Text style={styles.reviewCount}>(45k+)</Text>
                    </View>

                    <Text style={styles.productPrice}>{item.price}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.container, theme.container]}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/(tabs)')}>
                    <Feather name="arrow-left" size={24} color={theme.text.color} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, theme.text]}>My Favorites</Text>
            </View>

            {favoriteProducts.length > 0 ? (
                <FlatList
                    data={favoriteProducts}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    contentContainerStyle={styles.listContent}
                    columnWrapperStyle={styles.row}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Feather name="heart" size={64} color={isDarkMode ? '#2A2A2A' : '#F3E9EA'} style={styles.emptyIcon} />
                    <Text style={[styles.emptyTitle, theme.text]}>No Favorites Yet</Text>
                    <Text style={[styles.emptySubtitle, theme.subText]}>
                        Like some flowers to see them here and access them quickly later.
                    </Text>
                    <TouchableOpacity
                        style={styles.exploreButton}
                        onPress={() => router.push('/(tabs)')}
                    >
                        <Text style={styles.exploreButtonText}>Explore Products</Text>
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
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    productCard: {
        width: '46%', // Slightly smaller width
        backgroundColor: 'transparent',
        marginBottom: 24,
    },
    imageContainer: {
        position: 'relative',
        aspectRatio: 1, // Kvadrat (square)
        width: '100%',
        backgroundColor: '#F3E9EA',
        borderRadius: 8,
        overflow: 'hidden',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    favoriteButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    heartActive: {
        // Red color set directly in component for active state
    },
    productInfo: {
        paddingTop: 8,
    },
    deliveryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    deliveryText: {
        fontSize: 10,
        color: '#1F9939',
        fontWeight: '600',
        marginLeft: 4,
    },
    productName: {
        fontSize: 13,
        fontWeight: '400',
        color: '#333333',
        marginBottom: 4,
        lineHeight: 18,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    reviewCount: {
        fontSize: 10,
        color: '#888888',
        marginLeft: 4,
    },
    productPrice: {
        fontSize: 16,
        color: '#150935',
        fontWeight: '700',
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
        backgroundColor: '#D1A3A6',
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
});
