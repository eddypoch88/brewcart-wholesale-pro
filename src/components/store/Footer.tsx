import { useParams } from 'react-router-dom';
import { usePublicStore } from '../../hooks/usePublicStore';
import { DEFAULT_SETTINGS } from '../../data/mockData';

export default function Footer() {
    const { slug } = useParams<{ slug?: string }>();
    const { settings } = usePublicStore(slug);
    const storeName = settings?.store_name || DEFAULT_SETTINGS.store_name;

    return (
        <footer className="bg-slate-900 text-slate-400 py-10 mt-auto">
            <div className="max-w-6xl mx-auto px-4 text-center">
                <p className="font-bold text-white text-lg mb-1">{storeName}</p>
                <p className="text-sm mb-4">Fresh brews, delivered to your door.</p>
                <div className="h-px bg-slate-700 max-w-xs mx-auto mb-4" />
                <p className="text-xs">&copy; {new Date().getFullYear()} {storeName}. All rights reserved.</p>
            </div>
        </footer>
    );
}
