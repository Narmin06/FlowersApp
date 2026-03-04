import MapView, { Marker, PROVIDER_GOOGLE } from '@/components/Map';
import { useAppStore } from '@/store/useAppStore';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from "expo-device";
import * as Location from "expo-location";
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, KeyboardAvoidingView, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function CheckoutOverviewScreen() {
    const router = useRouter();
    const cartItems = useAppStore(state => state.cart);
    const checkoutDate = useAppStore(state => state.checkoutDate);
    const checkoutTime = useAppStore(state => state.checkoutTime);
    const checkoutAddressId = useAppStore(state => state.checkoutAddressId);
    const addresses = useAppStore(state => state.addresses);
    const addOrder = useAppStore(state => state.addOrder);
    const clearCart = useAppStore(state => state.clearCart);
    const isDarkMode = useAppStore(state => state.isDarkMode);

    const theme = isDarkMode ? darkTheme : lightTheme;

    const selectedAddress = addresses.find(a => a.id === checkoutAddressId);

    const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price.replace('$', '')) * item.quantity), 0);
    const delivery = subtotal > 0 ? 5.00 : 0.00;
    const total = subtotal + delivery;

    const [isCheckoutModalVisible, setCheckoutModalVisible] = useState(false);
    const [isFullScreenMapVisible, setFullScreenMapVisible] = useState(false);
    const [mapRegion, setMapRegion] = useState<any | null>(null);
    const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
    const [markerCoord, setMarkerCoord] = useState<any>(null);

    const mapRef = useRef<any>(null);
    const fullScreenMapRef = useRef<any>(null);

    useEffect(() => {
        async function getCurrentLocation() {
            if (Platform.OS === "android" && !Device.isDevice) {
                return;
            };
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setUserLocation(location);

            const region = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };
            setMapRegion(region);
            setMarkerCoord({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        }
        getCurrentLocation();
    }, []);

    useEffect(() => {
        if (Platform.OS !== 'web') return;
        const handleMessage = (event: MessageEvent) => {
            if (event.data && event.data.type === 'LOCATION_CHANGED') {
                if (markerCoord) {
                    setMarkerCoord({
                        latitude: event.data.latitude,
                        longitude: event.data.longitude
                    });
                }
            }
        };
        window.addEventListener('message', handleMessage as any);
        return () => window.removeEventListener('message', handleMessage as any);
    }, [markerCoord]);

    const handleZoomIn = () => {
        const delta = 2;
        setMapRegion((prev: any) => {
            if (!prev) return prev;
            const newRegion = {
                ...prev,
                latitudeDelta: prev.latitudeDelta / delta,
                longitudeDelta: prev.longitudeDelta / delta,
            };
            fullScreenMapRef.current?.animateToRegion(newRegion, 300);
            return newRegion;
        });
    };

    const handleZoomOut = () => {
        const delta = 2;
        setMapRegion((prev: any) => {
            if (!prev) return prev;
            const newRegion = {
                ...prev,
                latitudeDelta: prev.latitudeDelta * delta,
                longitudeDelta: prev.longitudeDelta * delta,
            };
            fullScreenMapRef.current?.animateToRegion(newRegion, 300);
            return newRegion;
        });
    };

    const jumpToUserLocation = () => {
        if (userLocation) {
            const newRegion = {
                latitude: userLocation.coords.latitude,
                longitude: userLocation.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };
            setMapRegion(newRegion);
            setMarkerCoord({
                latitude: userLocation.coords.latitude,
                longitude: userLocation.coords.longitude,
            });
            fullScreenMapRef.current?.animateToRegion(newRegion, 300);
        }
    };

    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleOpenPayment = () => {
        setCardName('');
        setCardNumber('');
        setExpiry('');
        setCvv('');
        setErrors({});
        setCheckoutModalVisible(true);
    };

    const handlePay = async () => {
        let newErrors: { [key: string]: string } = {};

        if (!cardNumber) {
            newErrors.cardNumber = "Enter the card number correctly.";
        } else {
            const numericCardNumber = cardNumber.replace(/\D/g, '');
            if (numericCardNumber.length !== 16) {
                newErrors.cardNumber = "Enter the card number correctly.";
            }
        }

        if (!cardName.trim()) {
            newErrors.cardName = "Enter the cardholder name.";
        }

        if (!expiry) {
            newErrors.expiry = "Enter the expiration date correctly";
        } else {
            const [monthStr, yearStr] = expiry.split('/');
            const monthNum = parseInt(monthStr, 10);
            const yearNum = parseInt(yearStr, 10);
            if (isNaN(monthNum) || monthNum < 1 || monthNum > 12 || expiry.includes('-') || isNaN(yearNum) || yearNum < 26) {
                newErrors.expiry = "Enter the expiration date correctly";
            }
        }

        if (!cvv) {
            newErrors.cvv = "Enter CVV.";
        } else if (!/^\d{3}$/.test(cvv)) {
            newErrors.cvv = "CVV must be exactly 3 digits.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        const orderItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const newOrder = {
            id: `ORD-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            status: 'On the way',
            items: orderItemsCount,
            total: `${Math.round(total)} AZN`
        };

        addOrder(newOrder);

        try {
            const dataStr = await AsyncStorage.getItem('userData');
            let data = dataStr ? JSON.parse(dataStr) : {};
            const existingOrders = data.orders || [];
            data.orders = [newOrder, ...existingOrders];
            await AsyncStorage.setItem('userData', JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save order history', error);
        }

        setCheckoutModalVisible(false);
        clearCart();

        if (Platform.OS !== 'web') {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Payment Confirmed! 🎉",
                    body: `Your order ${newOrder.id} has been placed successfully and is on its way.`,
                    data: { type: 'payment_confirmed', screen: '/orders' },
                },
                trigger: {
                    seconds: 1,
                    repeats: false,
                    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL
                },
            });
        } else {
            try {
                const historyJson = await AsyncStorage.getItem('notification_history');
                const history = historyJson ? JSON.parse(historyJson) : [];
                history.unshift({
                    id: `web-notif-${Date.now()}`,
                    title: "Payment Confirmed! 🎉",
                    body: `Your order ${newOrder.id} has been placed successfully and is on its way.`,
                    data: { type: 'payment_confirmed', screen: '/orders' },
                    receivedAt: new Date().toISOString()
                });
                await AsyncStorage.setItem('notification_history', JSON.stringify(history));
            } catch (e) {
                console.error(e);
            }
        }

        router.replace('/(tabs)');
    };

    const webLat = markerCoord?.latitude || userLocation?.coords.latitude || 40.409264;
    const webLng = markerCoord?.longitude || userLocation?.coords.longitude || 49.867092;

    const mapHtml = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
          <style>
              body { padding: 0; margin: 0; }
              #map { width: 100vw; height: 100vh; }
              
              /* Reposition defaults */
              .leaflet-top.leaflet-left {
                  display: flex;
                  flex-direction: row;
                  padding: 10px;
                  margin-top: 10px;
              }
              .leaflet-control-zoom {
                  display: flex;
                  flex-direction: row;
                  border: none !important;
                  margin: 0 !important;
              }
              .leaflet-control-zoom-in, .leaflet-control-zoom-out {
                  width: 36px !important;
                  height: 36px !important;
                  line-height: 36px !important;
                  box-sizing: border-box;
                  border-radius: 8px !important;
                  margin-right: 8px !important;
                  border: 1px solid #ccc !important;
                  background-color: white !important;
                  color: black !important;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                  font-weight: bold;
              }
          </style>
      </head>
      <body>
          <div id="map"></div>
          <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
          <script>
              var map = L.map('map', {
                  zoomControl: false 
              }).setView([${webLat}, ${webLng}], 15);
              
              L.control.zoom({
                  position: 'topleft'
              }).addTo(map);

              L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  attribution: '&copy; OpenStreetMap contributors'
              }).addTo(map);

              var myIcon = L.icon({
                  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41]
              });

              var marker = L.marker([${webLat}, ${webLng}], { draggable: true, icon: myIcon }).addTo(map);
              
              marker.on('dragend', function(event) {
                  var position = marker.getLatLng();
                  window.parent.postMessage({
                      type: 'LOCATION_CHANGED',
                      latitude: position.lat,
                      longitude: position.lng
                  }, '*');
              });
          </script>
      </body>
      </html>
    `;

    return (
        <SafeAreaView style={[styles.container, theme.container]}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Feather name="arrow-left" size={24} color={isDarkMode ? '#FFFFFF' : '#150935'} style={{ marginTop: 2 }} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, theme.text]}>Overview</Text>

                {/* Map Icon on Top Right */}
                <TouchableOpacity
                    style={styles.headerMapIcon}
                    onPress={() => setFullScreenMapVisible(true)}
                    activeOpacity={0.7}
                >
                    <Feather name="map" size={24} color={theme.text.color} style={{ marginTop: 2 }} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

                <View style={[styles.mapContainer, theme.card]}>
                    <MapView
                        ref={mapRef}
                        style={styles.map}
                        provider={PROVIDER_GOOGLE}
                        region={mapRegion}
                        showsUserLocation
                        showsMyLocationButton
                        showsCompass
                    >
                        {markerCoord && (
                            <Marker
                                coordinate={{
                                    latitude: markerCoord.latitude,
                                    longitude: markerCoord.longitude,
                                }}
                                title="Selected Location"
                                description="Delivery location"
                                pinColor="red"
                            />
                        )}
                    </MapView>
                </View>

                <Text style={[styles.sectionTitle, theme.text]}>Overview</Text>
                <View style={styles.rowCards}>
                    <View style={[styles.infoCard, theme.card]}>
                        <Text style={[styles.infoLabel, theme.subText]}>Delivery Date</Text>
                        <Text style={[styles.infoValue, theme.text]}>{checkoutDate}</Text>
                    </View>
                    <View style={[styles.infoCard, theme.card]}>
                        <Text style={[styles.infoLabel, theme.subText]}>Delivery Time</Text>
                        <Text style={[styles.infoValue, theme.text]}>{checkoutTime}</Text>
                    </View>
                </View>

                {/* Address Overview */}
                <Text style={[styles.sectionTitle, theme.text]}>Delivery location</Text>
                <View style={[styles.addressCard, theme.card]}>
                    <View style={[styles.iconBox, theme.cardBackground]}>
                        <Feather name="map-pin" size={20} color="#AD6D71" />
                    </View>
                    <View style={styles.addressInfo}>
                        <Text style={[styles.addressTitle, theme.text]}>{selectedAddress?.title || 'No address selected'}</Text>
                        <Text style={[styles.addressText, theme.subText]} numberOfLines={2}>
                            {selectedAddress?.address || 'Please go back and select an address'}
                        </Text>
                    </View>
                </View>

                {/* Payment Overview */}
                <Text style={[styles.sectionTitle, theme.text]}>Payment</Text>
                <TouchableOpacity
                    style={[styles.paymentCard, theme.card]}
                    onPress={handleOpenPayment}
                    activeOpacity={0.8}
                >
                    <View style={[styles.iconBox, theme.cardBackground]}>
                        <Feather name="credit-card" size={20} color="#AD6D71" />
                    </View>
                    <View style={styles.paymentInfo}>
                        <Text style={[styles.paymentTitle, theme.text]}>Credit/Debit Card</Text>
                        <Text style={[styles.paymentText, theme.subText]}>Tap to enter card details</Text>
                    </View>
                    <Feather name="chevron-right" size={20} color={theme.subText.color} />
                </TouchableOpacity>

            </ScrollView>

            {/* Bottom Pay Button Container */}
            <View style={[styles.footer, theme.card]}>
                <TouchableOpacity
                    style={styles.payButtonMain}
                    onPress={handleOpenPayment}
                >
                    <Text style={styles.payButtonMainText}>Pay | {Math.round(total)} AZN</Text>
                </TouchableOpacity>
            </View>

            {/* Checkout Modal */}
            <Modal
                visible={isCheckoutModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setCheckoutModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={[styles.modalContent, theme.card]}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, theme.text]}>Checkout Details</Text>
                            <TouchableOpacity onPress={() => setCheckoutModalVisible(false)} style={styles.closeModalButton}>
                                <Feather name="x" size={24} color={isDarkMode ? '#FFFFFF' : '#150935'} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView contentContainerStyle={styles.modalForm} showsVerticalScrollIndicator={false}>
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, theme.text]}>Card Number</Text>
                                <View style={[styles.inputContainer, { backgroundColor: isDarkMode ? '#1E1E1E' : '#F3E9EA', borderColor: errors.cardNumber ? '#FF3B30' : (isDarkMode ? '#2A2A2A' : '#F3E9EA') }]}>
                                    <Feather name="credit-card" size={20} color="#AA949C" style={styles.inputIcon} />
                                    <TextInput
                                        style={[styles.input, theme.text]}
                                        placeholder="0000 0000 0000 0000"
                                        placeholderTextColor={isDarkMode ? '#A0A0A0' : '#AA949C'}
                                        keyboardType="numeric"
                                        maxLength={16}
                                        value={cardNumber}
                                        onChangeText={(text) => setCardNumber(text.replace(/\D/g, ''))}
                                    />
                                </View>
                                {errors.cardNumber && <Text style={styles.errorText}>{errors.cardNumber}</Text>}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, theme.text]}>Cardholder Name</Text>
                                <View style={[styles.inputContainer, { backgroundColor: isDarkMode ? '#1E1E1E' : '#F3E9EA', borderColor: errors.cardName ? '#FF3B30' : (isDarkMode ? '#2A2A2A' : '#F3E9EA') }]}>
                                    <Feather name="user" size={20} color="#AA949C" style={styles.inputIcon} />
                                    <TextInput
                                        style={[styles.input, theme.text]}
                                        placeholder="Your Name"
                                        placeholderTextColor={isDarkMode ? '#A0A0A0' : '#AA949C'}
                                        autoCapitalize="words"
                                        value={cardName}
                                        onChangeText={setCardName}
                                    />
                                </View>
                                {errors.cardName && <Text style={styles.errorText}>{errors.cardName}</Text>}
                            </View>

                            <View style={styles.rowInputs}>
                                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                                    <Text style={[styles.label, theme.text]}>Expiry Date</Text>
                                    <View style={[styles.inputContainer, { backgroundColor: isDarkMode ? '#1E1E1E' : '#F3E9EA', borderColor: errors.expiry ? '#FF3B30' : (isDarkMode ? '#2A2A2A' : '#F3E9EA') }]}>
                                        <TextInput
                                            style={[styles.input, theme.text]}
                                            placeholder="MM/YY"
                                            placeholderTextColor={isDarkMode ? '#A0A0A0' : '#AA949C'}
                                            maxLength={5}
                                            value={expiry}
                                            onChangeText={setExpiry}
                                        />
                                    </View>
                                    {errors.expiry && <Text style={styles.errorText}>{errors.expiry}</Text>}
                                </View>

                                <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
                                    <Text style={[styles.label, theme.text]}>CVV</Text>
                                    <View style={[styles.inputContainer, { backgroundColor: isDarkMode ? '#1E1E1E' : '#F3E9EA', borderColor: errors.cvv ? '#FF3B30' : (isDarkMode ? '#2A2A2A' : '#F3E9EA') }]}>
                                        <TextInput
                                            style={[styles.input, theme.text]}
                                            placeholder="123"
                                            placeholderTextColor={isDarkMode ? '#A0A0A0' : '#AA949C'}
                                            keyboardType="numeric"
                                            maxLength={3}
                                            value={cvv}
                                            onChangeText={(text) => setCvv(text.replace(/\D/g, ''))}
                                            secureTextEntry
                                        />
                                    </View>
                                    {errors.cvv && <Text style={styles.errorText}>{errors.cvv}</Text>}
                                </View>
                            </View>

                            <View style={styles.modalTotalContainer}>
                                <Text style={[styles.modalTotalText, theme.text]}>Total to Pay:</Text>
                                <Text style={[styles.modalTotalAmount, theme.text]}>{Math.round(total)} AZN</Text>
                            </View>

                            <TouchableOpacity style={styles.payButton} onPress={handlePay} activeOpacity={0.8}>
                                <Text style={styles.payButtonText}>Pay Now</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </Modal>

            {/* Full Screen Map Modal */}
            <Modal
                visible={isFullScreenMapVisible}
                animationType="slide"
                transparent={false}
                onRequestClose={() => setFullScreenMapVisible(false)}
            >
                <View style={styles.fullScreenMapContainer}>
                    {Platform.OS === 'web' ? (
                        <>
                            {/* @ts-ignore */}
                            <iframe
                                srcDoc={mapHtml}
                                style={{ width: "100%", height: "100%", border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                            />

                            <TouchableOpacity style={[styles.mapButton, { position: 'absolute', top: 70, left: 110, zIndex: 10 }]} onPress={() => setFullScreenMapVisible(false)} activeOpacity={0.8}>
                                <Feather name="chevron-left" size={24} color="#000000" />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.locationButton} onPress={jumpToUserLocation} activeOpacity={0.8}>
                                <Feather name="navigation" size={24} color="#000000" />
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <MapView
                                ref={fullScreenMapRef}
                                style={styles.fullScreenMap}
                                provider={PROVIDER_GOOGLE}
                                region={mapRegion}
                                showsUserLocation={false}
                                showsMyLocationButton={false}
                                showsCompass={false}
                            >
                                {markerCoord && (
                                    <Marker
                                        coordinate={{
                                            latitude: markerCoord.latitude,
                                            longitude: markerCoord.longitude,
                                        }}
                                        title="Selected Location"
                                        description="Drag to move location"
                                        pinColor="red"
                                        draggable
                                        onDragEnd={(e) => {
                                            setMarkerCoord(e.nativeEvent.coordinate);
                                            if (mapRef.current) {
                                                mapRef.current.animateToRegion({
                                                    latitude: e.nativeEvent.coordinate.latitude,
                                                    longitude: e.nativeEvent.coordinate.longitude,
                                                    latitudeDelta: 0.01,
                                                    longitudeDelta: 0.01,
                                                });
                                            }
                                            setMapRegion({
                                                latitude: e.nativeEvent.coordinate.latitude,
                                                longitude: e.nativeEvent.coordinate.longitude,
                                                latitudeDelta: 0.01,
                                                longitudeDelta: 0.01,
                                            });
                                        }}
                                    />
                                )}
                            </MapView>

                            {/* Fixed Zoom Controls on Map */}
                            <View style={styles.zoomControls}>
                                <View style={styles.zoomButtonsRow}>
                                    <TouchableOpacity style={styles.mapSmallButton} onPress={handleZoomIn} activeOpacity={0.8}>
                                        <Feather name="plus" size={20} color="#000000" />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.mapSmallButton} onPress={handleZoomOut} activeOpacity={0.8}>
                                        <Feather name="minus" size={20} color="#000000" />
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity style={[styles.mapButton, { marginTop: 12 }]} onPress={() => setFullScreenMapVisible(false)} activeOpacity={0.8}>
                                    <Feather name="chevron-left" size={24} color="#000000" />
                                </TouchableOpacity>
                            </View>

                            {/* Location Navigation Button on the Right */}
                            <TouchableOpacity style={styles.locationButton} onPress={jumpToUserLocation} activeOpacity={0.8}>
                                <Feather name="navigation" size={24} color="#000000" />
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </Modal>
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
    card: { backgroundColor: '#FFFFFF', borderColor: '#F3E9EA', borderWidth: 1 },
    cardBackground: { backgroundColor: '#FCF3F5' },
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
    headerTitle: { fontSize: 20, fontWeight: '600', flex: 1 },
    headerMapIcon: {
        marginLeft: 'auto',
        padding: 4,
    },
    content: { padding: 20, paddingBottom: 100 },
    mapContainer: {
        height: 180,
        borderRadius: 24,
        marginBottom: 24,
        overflow: 'hidden',
        position: 'relative'
    },
    map: {
        width: '100%',
        height: '100%',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
    },
    rowCards: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    infoCard: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
    },
    infoLabel: {
        fontSize: 13,
        marginBottom: 8,
    },
    infoValue: {
        fontSize: 15,
        fontWeight: '600',
    },
    addressCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
    },
    iconBox: {
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
    paymentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
    },
    paymentInfo: {
        flex: 1,
    },
    paymentTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    paymentText: {
        fontSize: 14,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 10,
        backgroundColor: '#FFFFFF',
    },
    payButtonMain: {
        backgroundColor: '#AD6D71',
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    payButtonMainText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },

    // Modal Styles
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
        borderWidth: 1,
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
        height: '100%',
    },
    rowInputs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: 6,
        marginLeft: 4,
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
        fontWeight: '500',
    },
    modalTotalAmount: {
        fontSize: 24,
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

    // Full Screen Map Styles
    fullScreenMapContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    fullScreenMap: {
        ...StyleSheet.absoluteFillObject,
    },
    zoomControls: {
        position: 'absolute',
        top: 60,
        left: 20,
        zIndex: 10,
    },
    zoomButtonsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    mapButton: {
        width: 48,
        height: 48,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 5,
    },
    mapSmallButton: {
        width: 36,
        height: 36,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 5,
    },
    locationButton: {
        position: 'absolute',
        top: 60,
        right: 20,
        width: 48,
        height: 48,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 10,
    },
});

