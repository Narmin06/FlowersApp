import { clearNotificationHistory, getNotificationHistory, NotificationHistoryItem } from "@/services/push-service";
import { useAppStore } from "@/store/useAppStore";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function NotificationsScreen() {
    const router = useRouter();
    const isDarkMode = useAppStore((state) => state.isDarkMode);
    const theme = isDarkMode ? darkTheme : lightTheme;

    const [history, setHistory] = useState<NotificationHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useFocusEffect(
        useCallback(() => {
            let cancelled = false;
            setLoading(true);
            getNotificationHistory()
                .then((list) => {
                    if (!cancelled)
                        setHistory((Array.isArray(list) ? list : []) as NotificationHistoryItem[]);
                })
                .finally(() => {
                    if (!cancelled) setLoading(false);
                });
            return () => {
                cancelled = true;
            };
        }, [])
    );

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        const list = await getNotificationHistory();
        setHistory((Array.isArray(list) ? list : []) as NotificationHistoryItem[]);
        setRefreshing(false);
    }, []);

    const onClear = useCallback(async () => {
        await clearNotificationHistory();
        setHistory([]);
    }, []);

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, theme.container]}>
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#AD6D71" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, theme.container]}>
            <View style={[styles.header, theme.headerBorder]}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Feather name="arrow-left" size={24} color={isDarkMode ? '#FFFFFF' : '#150935'} style={{ marginTop: 2 }} />
                </TouchableOpacity>
                <Text style={[styles.title, theme.text]}>Notifications</Text>
                <View style={styles.rightHeader}>
                    {history.length > 0 && (
                        <TouchableOpacity onPress={onClear} hitSlop={12} style={styles.clearButton}>
                            <Feather name="trash-2" size={18} color="#AD6D71" />
                            <Text style={styles.clearText}>Clear</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {history.length === 0 ? (
                <View style={styles.empty}>
                    <Feather
                        name="bell-off"
                        size={64}
                        color={isDarkMode ? '#555' : '#E0CCD0'}
                        style={{ marginBottom: 20 }}
                    />
                    <Text style={[styles.emptyText, theme.text]}>No notifications yet</Text>
                    <Text style={[styles.emptySubtext, theme.subText]}>
                        Booking and payment confirmations will appear here.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={history}
                    keyExtractor={(item) => item.id}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#AD6D71" />
                    }
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View style={[styles.card, theme.card]}>
                            <Text style={[styles.cardTitle, theme.text]} numberOfLines={1}>
                                {item.title}
                            </Text>
                            <Text style={[styles.cardBody, theme.subText]} numberOfLines={3}>
                                {item.body}
                            </Text>
                            <Text style={styles.cardTime}>
                                {item.receivedAt
                                    ? new Date(item.receivedAt).toLocaleString()
                                    : ""}
                            </Text>
                        </View>
                    )}
                />
            )}
        </SafeAreaView>
    );
}

const darkTheme = StyleSheet.create({
    container: { backgroundColor: '#121212' },
    text: { color: '#FFFFFF' },
    subText: { color: '#A0A0A0' },
    card: { backgroundColor: '#1E1E1E' },
    headerBorder: { borderBottomColor: 'rgba(255,255,255,0.1)' }
});

const lightTheme = StyleSheet.create({
    container: { backgroundColor: '#FCF8F9' },
    text: { color: '#150935' },
    subText: { color: '#AA949C' },
    card: { backgroundColor: '#FFFFFF', borderColor: '#F3E9EA', borderWidth: 1 },
    headerBorder: { borderBottomColor: 'rgba(0,0,0,0.08)' }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    backButton: {
        width: 40,
    },
    title: {
        flex: 1,
        fontSize: 20,
        fontWeight: "600",
        textAlign: "center",
    },
    rightHeader: {
        width: 60,
        alignItems: "flex-end",
    },
    clearButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    clearText: {
        fontSize: 14,
        color: '#AD6D71',
        fontWeight: "500",
    },
    empty: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: "600",
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        marginTop: 8,
        textAlign: "center",
    },
    listContent: {
        padding: 16,
        paddingBottom: 32,
    },
    card: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "600",
    },
    cardBody: {
        fontSize: 14,
        marginTop: 6,
        lineHeight: 20,
    },
    cardTime: {
        fontSize: 12,
        color: "#888",
        marginTop: 10,
    },
});
