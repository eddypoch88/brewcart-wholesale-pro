import { usePushNotifications } from '../../hooks/usePushNotifications';
import { Bell } from 'lucide-react';

export function NotificationPrompt() {
    const { permission, enableNotifications } = usePushNotifications();

    if (permission === 'granted') return null;
    if (permission === 'denied') return null;

    return (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                    <Bell className="h-5 w-5" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-blue-900">Enable Push Notifications</h4>
                    <p className="text-xs text-blue-700">Get instant alerts for new orders even when the app is closed.</p>
                </div>
            </div>
            <button
                onClick={enableNotifications}
                className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
            >
                Enable
            </button>
        </div>
    );
}
