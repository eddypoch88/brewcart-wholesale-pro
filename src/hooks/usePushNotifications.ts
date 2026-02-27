import { useEffect, useState } from 'react';
import { requestNotificationPermission, onMessageListener } from '../lib/firebase';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { useStore } from '../context/StoreContext';

export function usePushNotifications() {
  const { storeId } = useStore();
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  // Request permission on mount
  useEffect(() => {
    if (!('Notification' in window)) {
      console.log('Notifications not supported');
      return;
    }

    setPermission(Notification.permission);

    if (Notification.permission === 'default') {
      // Auto-request after 3 seconds
      const timer = setTimeout(async () => {
        const token = await requestNotificationPermission();
        if (token) {
          setFcmToken(token);
          await saveFCMToken(token);
        }
        setPermission(Notification.permission);
      }, 3000);
      return () => clearTimeout(timer);
    } else if (Notification.permission === 'granted') {
      // Get token if already granted
      requestNotificationPermission().then(token => {
        if (token) {
          setFcmToken(token);
          saveFCMToken(token);
        }
      });
    }
  }, [storeId]);

  // Save FCM token to database
  const saveFCMToken = async (token: string) => {
    if (!storeId) return;

    try {
      const { error } = await supabase
        .from('store_settings')
        .update({
          fcm_token: token,
          notifications_enabled: true
        })
        .eq('store_id', storeId);

      if (error) throw error;
      console.log('FCM token saved to database');
    } catch (error) {
      console.error('Error saving FCM token:', error);
    }
  };

  // Listen for foreground messages (Firebase FCM)
  useEffect(() => {
    let isSubscribed = true;

    const listenForMessages = async () => {
        try {
            const payload: any = await onMessageListener();
            if (!isSubscribed) return;

            console.log('Received foreground FCM notification:', payload);
            
            toast.success(
              `${payload.notification?.title || 'New Notification'}: ${payload.notification?.body}`,
              { duration: 6000, position: 'top-center' }
            );

            // Play notification sound
            const audio = new Audio('/notification.mp3');
            audio.play().catch(e => console.error('Audio play failed:', e));

            // Update badge count
            if ('setAppBadge' in navigator) {
              (navigator as any).setAppBadge(1).catch((e: any) => console.log('Badge error:', e));
            }

            // Keep listening
            listenForMessages();
        } catch (err) {
            console.log('FCM listener stopped or failed:', err);
        }
    };

    if (permission === 'granted') {
      listenForMessages();
    }

    return () => {
      isSubscribed = false;
    };
  }, [permission]);

  const enableNotifications = async () => {
    const token = await requestNotificationPermission();
    if (token) {
      setFcmToken(token);
      await saveFCMToken(token);
      setPermission(Notification.permission);
      return true;
    }
    return false;
  };

  return {
    fcmToken,
    permission,
    isEnabled: permission === 'granted',
    enableNotifications
  };
}
