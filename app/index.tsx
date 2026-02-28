import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const SLIDES = [
    {
        id: '1',
        title: 'Fresh & Beautiful Flowers',
        description: 'Handpicked flowers delivered to your doorstep',
        image: require('../assets/images/purple_tulips.jpg'),
    },
    {
        id: '2',
        title: 'Fast Delivery',
        description: 'Same day delivery available in your area',
        image: require('../assets/images/pink_lily.jpg'),
    },
    {
        id: '3',
        title: 'Make Someone Happy Today',
        description: 'Perfect gifts for every special occasion',
        image: require('../assets/images/red_tulips2.jpg'),
    },
];

export default function OnboardingScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const router = useRouter();

    const handleNext = () => {
        if (currentIndex < SLIDES.length - 1) {
            flatListRef.current?.scrollToOffset({ offset: (currentIndex + 1) * width, animated: true });
            setCurrentIndex(currentIndex + 1);
        } else {
            router.replace('/sign-in');
        }
    };

    const handleSkip = () => {
        router.replace('/sign-in');
    };

    const onScroll = (event: any) => {
        const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(slideIndex);
    };

    const renderItem = ({ item }: { item: typeof SLIDES[0] }) => {
        return (
            <View style={[styles.slide, { width }]}>
                <Image source={item.image} style={styles.image} resizeMode="cover" />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={SLIDES}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal
                snapToAlignment="center"
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                bounces={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
            />

            <View style={styles.footer}>
                <View style={styles.dotsContainer}>
                    {SLIDES.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                currentIndex === index ? styles.activeDot : styles.inactiveDot,
                            ]}
                        />
                    ))}
                </View>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.skipButton} onPress={handleSkip} activeOpacity={0.7}>
                        <Text style={styles.skipButtonText}>Skip</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.8}>
                        <Text style={styles.nextButtonText}>
                            {currentIndex === SLIDES.length - 1 ? 'Get Started >' : 'Next >'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FCF8F9',
    },
    slide: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FCF8F9',
    },
    image: {
        width: '100%',
        height: height * 0.58, // Image height matching the screenshots structure
    },
    textContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 35, // Spacing matching the screenshot
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        color: '#150935', // Dark navy/purple color for title
        marginBottom: 12,
        textAlign: 'center',
    },
    description: {
        fontSize: 14,
        color: '#AA949C', // Grayish pink subtitle
        textAlign: 'center',
        lineHeight: 20,
        fontWeight: '400',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 24,
        paddingBottom: 40,
        alignItems: 'center',
    },
    dotsContainer: {
        flexDirection: 'row',
        marginBottom: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        height: 6,
        borderRadius: 3,
        marginHorizontal: 3,
    },
    activeDot: {
        width: 24, // Wider pill for active dot
        backgroundColor: '#AD6D71', // Muted pink
    },
    inactiveDot: {
        width: 6,
        backgroundColor: '#EFE4E5', // Very light dot for inactive
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 4,
    },
    skipButton: {
        flex: 1,
        height: 54,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F3E9EA',
        borderRadius: 27,
        marginRight: 8,
        backgroundColor: '#FCF8F9',
    },
    skipButtonText: {
        color: '#150935',
        fontSize: 15,
        fontWeight: '500',
    },
    nextButton: {
        flex: 1,
        height: 54,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#AD6D71', // Muted pink filled button
        borderRadius: 27,
        marginLeft: 8,
    },
    nextButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },
});
