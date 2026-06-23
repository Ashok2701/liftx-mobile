import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export class NotificationService {
  static async requestPermission(): Promise<boolean> {
    if (!Device.isDevice) return false;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#6C47FF',
      });
    }
    return finalStatus === 'granted';
  }

  static async getExpoPushToken(): Promise<string | null> {
    try {
      const granted = await this.requestPermission();
      if (!granted) return null;
      const token = await Notifications.getExpoPushTokenAsync();
      return token.data;
    } catch {
      return null;
    }
  }

  static async registerToken(): Promise<void> {
    // Token registration to backend would go here
    const token = await this.getExpoPushToken();
    if (token) console.log('Expo push token:', token);
  }

  static onForegroundMessage(callback: (n: { title?: string; body?: string }) => void) {
    return Notifications.addNotificationReceivedListener((notification) => {
      callback({
        title: notification.request.content.title ?? undefined,
        body: notification.request.content.body ?? undefined,
      });
    });
  }

  static onNotificationOpenedApp(callback: (data?: Record<string, string>) => void) {
    return Notifications.addNotificationResponseReceivedListener((response) => {
      callback(response.notification.request.content.data as Record<string, string>);
    });
  }

  static onBackgroundMessage() {
    // Handled by expo-notifications automatically
  }
}
