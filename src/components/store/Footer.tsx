import { getSettings } from '../../lib/storage';

export default function Footer() {
    const settings = getSettings();

    return (
        <footer className="bg-slate-900 text-slate-400 py-10 mt-auto">
            <div className="max-w-6xl mx-auto px-4 text-center">
                <p className="font-bold text-white text-lg mb-1">{settings.store_name}</p>
                <p className="text-sm mb-4">Fresh brews, delivered to your door.</p>
                <div className="h-px bg-slate-700 max-w-xs mx-auto mb-4" />
                <p className="text-xs">&copy; {new Date().getFullYear()} {settings.store_name}. All rights reserved.</p>
            </div>
        </footer>
    );
}
