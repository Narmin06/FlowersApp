import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Subscription } from 'expo-notifications';
import { router } from 'expo-router';
import { Platform } from 'react-native';

export type NotificationHistoryItem = {
    id: string;
    title: string;
    body: string;
    data?: Record<string, unknown>;
    receivedAt: string;
    scheduledAt?: string;
};

const NOTIFICATION_HISTORY_KEY = 'notification_history';

export function configureNotificationHandler() {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
            shouldShowBanner: true,
            shouldShowList: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
        }),
    });
}

export async function registerForPushNotifications(): Promise<string | null> {
    try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.warn('Push notification permission not granted');
            return null;
        }

        let token = '';
        try {
            const tokenData = await Notifications.getExpoPushTokenAsync({
                projectId: 'dummy-project-id'
            });
            token = tokenData.data;
        } catch (e) {
            token = 'dummy-expo-token-device';
        }

        await AsyncStorage.setItem('pushToken', token);

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'Default Notifications',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#AD6D71',
                sound: 'default',
                enableVibrate: true,
                showBadge: true,
            });
        }

        return token;
    } catch (error) {
        console.error('Error registering for push notifications:', error);
        return null;
    }
}

let notificationListener: Subscription | undefined;
let responseListener: Subscription | undefined;

export function setupNotificationListeners() {
    notificationListener = Notifications.addNotificationReceivedListener(async (notification) => {
        const { request } = notification;
        const newItem: NotificationHistoryItem = {
            id: request.identifier,
            title: request.content.title || 'Notification',
            body: request.content.body || '',
            data: request.content.data,
            receivedAt: new Date().toISOString()
        };

        try {
            const historyJson = await AsyncStorage.getItem(NOTIFICATION_HISTORY_KEY);
            const history: NotificationHistoryItem[] = historyJson ? JSON.parse(historyJson) : [];
            if (!history.find(h => h.id === newItem.id)) {
                const newHistory = [newItem, ...history];
                await AsyncStorage.setItem(NOTIFICATION_HISTORY_KEY, JSON.stringify(newHistory));
            }
        } catch (e) {
            console.error('Failed to save notification to history:', e);
        }
    });

    responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;

        if (data?.screen) {
            router.push(data.screen as any);
        } else {
            router.push('/notifications');
        }
    });
}

export function removeNotificationListeners() {
    if (notificationListener) {
        notificationListener.remove();
        notificationListener = undefined;
    }
    if (responseListener) {
        responseListener.remove();
        responseListener = undefined;
    }
}

export async function getNotificationHistory(): Promise<NotificationHistoryItem[]> {
    try {
        const historyJson = await AsyncStorage.getItem(NOTIFICATION_HISTORY_KEY);
        return historyJson ? JSON.parse(historyJson) : [];
    } catch (e) {
        console.error('Error getting history:', e);
        return [];
    }
}

export async function clearNotificationHistory(): Promise<void> {
    try {
        await AsyncStorage.removeItem(NOTIFICATION_HISTORY_KEY);
    } catch (e) {
        console.error('Error clearing history:', e);
    }
}
