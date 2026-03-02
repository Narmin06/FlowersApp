import { useAppStore } from '@/store/useAppStore';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
const CATEGORIES = ['All', 'Roses', 'Bouquets', 'Tulips'];
export default function HomeScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const userName = useAppStore(state => state.userName);
  const products = useAppStore(state => state.products);
  const favorites = useAppStore(state => state.favorites);
  const toggleFavorite = useAppStore(state => state.toggleFavorite);
  const isDarkMode = useAppStore(state => state.isDarkMode);

  const theme = isDarkMode ? darkTheme : lightTheme;

  const displayedProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.categories.includes(activeCategory);
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderProduct = ({ item }: { item: any }) => {
    const favorite = favorites.includes(item.id);
    return (
      <TouchableOpacity
        style={styles.productCard}
        activeOpacity={0.9}
        onPress={() => router.push(`/product/${item.id}` as any)}
      >
        <View style={[styles.imageContainer, theme.cardBackground]}>
          <Image source={item.image} style={styles.productImage} resizeMode="cover" />
          <TouchableOpacity
            style={[styles.favoriteButton, theme.card]}
            onPress={() => toggleFavorite(item.id)}
            activeOpacity={0.8}
          >
            {favorite ? (
              <FontAwesome name="heart" size={14} color="#FF3B30" />
            ) : (
              <Feather name="heart" size={14} color={isDarkMode ? '#A0A0A0' : '#AA949C'} />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.productInfo}>

          <Text style={[styles.productName, theme.text]} numberOfLines={2}>{item.name}</Text>

          <View style={styles.ratingRow}>
            <FontAwesome name="star" size={10} color="#FACC15" />
            <FontAwesome name="star" size={10} color="#FACC15" />
            <FontAwesome name="star" size={10} color="#FACC15" />
            <FontAwesome name="star" size={10} color="#FACC15" />
            <FontAwesome name="star-half-empty" size={10} color="#FACC15" />
            <Text style={styles.reviewCount}>(45k+)</Text>
          </View>

          <Text style={[styles.productPrice, theme.text]}>{item.price}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, theme.container]}>
      <FlatList
        data={displayedProducts}
        keyExtractor={item => item.id}
        numColumns={2}
        renderItem={renderProduct}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        columnWrapperStyle={[styles.row, { paddingHorizontal: 20 }]}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => router.replace('/sign-in')} style={styles.backButton}>
                  <Feather name="arrow-left" size={24} color={isDarkMode ? '#FFFFFF' : '#150935'} style={{ marginTop: 2 }} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[styles.welcomeText, theme.text, { marginBottom: 0, marginRight: 6, fontSize: 20, fontWeight: '500', color: isDarkMode ? '#FFFFFF' : '#150935' }]}>Welcome</Text>
                  <Text style={[styles.userName, theme.text, { fontSize: 20 }]}>{userName}</Text>
                </View>
              </View>
            </View>

            <View style={[styles.searchContainer, theme.cardBackground]}>
              <Feather name="search" size={20} color={isDarkMode ? '#A0A0A0' : '#AA949C'} style={styles.searchIcon} />
              <TextInput
                style={[styles.searchInput, theme.text]}
                placeholder="Search flowers..."
                placeholderTextColor={isDarkMode ? '#A0A0A0' : '#AA949C'}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <View style={styles.categoriesContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
                {CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryPill,
                      activeCategory === category
                        ? styles.categoryPillActive
                        : [styles.categoryPillInactive, theme.card, { borderColor: isDarkMode ? '#2A2A2A' : '#FCF3F5' }]
                    ]}
                    onPress={() => setActiveCategory(category)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        activeCategory === category
                          ? styles.categoryTextActive
                          : [styles.categoryTextInactive, theme.text]
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.popularSection}>
              <Text style={[styles.sectionTitle, theme.text]}>Popular Flowers</Text>
            </View>
          </View>
        }
      />
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
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 14,
    color: '#AA949C',
    fontWeight: '500',
    marginBottom: 4,
  },
  backButton: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#150935',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCF3F5',
    marginHorizontal: 20,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#150935',
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryPillActive: {
    backgroundColor: '#AD6D71',
  },
  categoryPillInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FCF3F5',
  },
  categoryText: {
    fontSize: 15,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  categoryTextInactive: {
    color: '#150935',
  },
  popularSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#150935',
    marginBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  productCard: {
    width: '46%',
    backgroundColor: 'transparent',
    marginBottom: 24,
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 1,
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
    //
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
});
