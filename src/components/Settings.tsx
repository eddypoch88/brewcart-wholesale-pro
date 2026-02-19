import { useState, useEffect, ChangeEvent } from 'react';
import { Save, Building2, Phone, Globe, Truck, CreditCard, Clock, Bell, Loader2, BanknoteIcon, Image as ImageIcon, X, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { getSettings, saveSettings } from '../lib/storage';
import { useStore } from '../context/StoreContext';
import { StoreSettings } from '../types';
import { DEFAULT_SETTINGS } from '../data/mockData';

export default function Settings() {
    const { reload } = useStore();
    const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
    const [saveLoading, setSaveLoading] = useState(false);
    const [isOperatingHoursExpanded, setIsOperatingHoursExpanded] = useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            const currentSettings = await getSettings();
            setSettings({
                ...DEFAULT_SETTINGS,
                ...currentSettings,
                operating_hours: {
                    ...DEFAULT_SETTINGS.operating_hours,
                    ...(currentSettings.operating_hours || {})
                }
            });
        };
        loadSettings();
    }, []);

    const updateSettings = (updates: Partial<StoreSettings>) => {
        setSettings({ ...settings, ...updates });
    };

    const updateOperatingHours = (day: keyof StoreSettings['operating_hours'], field: 'open' | 'close' | 'closed', value: string | boolean) => {
        setSettings({
            ...settings,
            operating_hours: {
                ...settings.operating_hours,
                [day]: { ...settings.operating_hours[day], [field]: value }
            }
        });
    };

    const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
        if (!validTypes.includes(file.type)) {
            toast.error('❌ Please upload PNG, JPG, or SVG only');
            return;
        }

        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('❌ Logo must be under 2MB');
            return;
        }

        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
            updateSettings({ logo_url: reader.result as string });
            toast.success('✅ Logo uploaded!');
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveLogo = () => {
        updateSettings({ logo_url: '' });
        toast.success('✅ Logo removed');
    };

    const handleSave = async () => {
        setSaveLoading(true);

        // Simulate API call delay for better UX feedback
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            await saveSettings(settings);
            reload();
            toast.success('✅ Settings saved successfully!', {
                duration: 3000,
                position: 'top-center',
                style: {
                    background: '#10b981',
                    color: '#fff',
                    fontWeight: '600',
                    padding: '16px 24px',
                    borderRadius: '12px',
                },
                icon: '✓',
            });
        } catch (error) {
            toast.error('❌ Failed to save settings. Please try again.', {
                duration: 4000,
                position: 'top-center',
            });
        } finally {
            setSaveLoading(false);
        }
    };

    const formatTime = (time: string) => {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        const h = parseInt(hours, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const formattedHour = h % 12 || 12;
        return `${formattedHour}:${minutes} ${ampm}`;
    };

    const getOperatingHoursSummary = () => {
        const hours = settings.operating_hours;
        if (!hours) return 'Not configured';

        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

        // Check if all days are closed
        const allClosed = days.every(d => hours[d].closed);
        if (allClosed) return 'Temporarily Closed';

        // Check if all days have same hours
        const firstDay = hours['monday'];
        const allSame = days.every(d =>
            hours[d].closed === firstDay.closed &&
            hours[d].open === firstDay.open &&
            hours[d].close === firstDay.close
        );

        if (allSame) {
            return `Everyday: ${firstDay.closed ? 'Closed' : `${formatTime(firstDay.open)} - ${formatTime(firstDay.close)}`}`;
        }

        // Group Mon-Fri
        const weekdays = days.slice(0, 5);
        const mon = hours['monday'];
        const weekdaysSame = weekdays.every(d =>
            hours[d].closed === mon.closed &&
            hours[d].open === mon.open &&
            hours[d].close === mon.close
        );

        const weekendDays = days.slice(5);
        const sat = hours['saturday'];
        const weekendsSame = weekendDays.every(d =>
            hours[d].closed === sat.closed &&
            hours[d].open === sat.open &&
            hours[d].close === sat.close
        );

        if (weekdaysSame && weekendsSame) {
            const weekdayStr = mon.closed ? 'Mon-Fri: Closed' : `Mon-Fri: ${formatTime(mon.open)} - ${formatTime(mon.close)}`;
            const weekendStr = sat.closed ? 'Sat-Sun: Closed' : `Sat-Sun: ${formatTime(sat.open)} - ${formatTime(sat.close)}`;
            return `${weekdayStr} | ${weekendStr}`;
        }

        return 'Custom Schedule';
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-8">
            <h1 className="text-2xl font-bold text-slate-900">Settings</h1>

            {/* 1. STORE INFORMATION */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Building2 size={20} className="text-blue-600" />
                    Store Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Store Name</label>
                        <input
                            type="text"
                            value={settings.store_name}
                            onChange={(e) => updateSettings({ store_name: e.target.value })}
                            placeholder="My Coffee Shop"
                            className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">WhatsApp Number</label>
                        <input
                            type="text"
                            value={settings.whatsapp_number}
                            onChange={(e) => updateSettings({ whatsapp_number: e.target.value })}
                            placeholder="60123456789"
                            className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <p className="mt-1 text-xs text-slate-500">Format: Numbers only (e.g., 60123456789)</p>
                    </div>
                </div>
            </div>

            {/* 2. BRANDING */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <ImageIcon size={20} className="text-blue-600" />
                    Branding
                </h2>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">Store Logo</label>

                    {/* Logo Preview */}
                    {settings.logo_url ? (
                        <div className="flex items-center gap-4 mb-4">
                            <div className="relative">
                                <img
                                    src={settings.logo_url}
                                    alt="Store logo"
                                    className="w-24 h-24 rounded-full object-cover border-2 border-slate-200"
                                />
                                <button
                                    onClick={handleRemoveLogo}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                                    title="Remove logo"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="text-sm text-slate-600">
                                <p className="font-medium">Logo uploaded</p>
                                <p className="text-xs text-slate-500">Click X to remove</p>
                            </div>
                        </div>
                    ) : (
                        <div className="mb-4 w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center">
                            <ImageIcon size={32} className="text-slate-400" />
                        </div>
                    )}

                    {/* Upload Button */}
                    <div>
                        <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-100 transition cursor-pointer">
                            <ImageIcon size={18} />
                            <span className="font-medium">Upload Logo</span>
                            <input
                                type="file"
                                accept=".png,.jpg,.jpeg,.svg"
                                onChange={handleLogoUpload}
                                className="hidden"
                            />
                        </label>
                        <p className="mt-2 text-xs text-slate-500">
                            Recommended: 400x400px, PNG or SVG with transparent background (max 2MB)
                        </p>
                    </div>
                </div>
            </div>

            {/* 3. CURRENCY & REGIONAL */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Globe size={20} className="text-blue-600" />
                    Currency & Regional
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
                        <select
                            value={settings.currency}
                            onChange={(e) => updateSettings({ currency: e.target.value })}
                            className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="MYR">MYR - Malaysian Ringgit</option>
                            <option value="USD">USD - US Dollar</option>
                            <option value="SGD">SGD - Singapore Dollar</option>
                            <option value="IDR">IDR - Indonesian Rupiah</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Timezone</label>
                        <select
                            value={settings.timezone}
                            onChange={(e) => updateSettings({ timezone: e.target.value })}
                            className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="Asia/Kuala_Lumpur">Asia/Kuala Lumpur (GMT+8)</option>
                            <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                            <option value="Asia/Jakarta">Asia/Jakarta (GMT+7)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* 3. DELIVERY SETTINGS */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Truck size={20} className="text-blue-600" />
                    Delivery Settings
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Delivery Fee ({settings.currency})</label>
                        <input
                            type="number"
                            step="0.01"
                            value={settings.delivery_fee}
                            onChange={(e) => updateSettings({ delivery_fee: parseFloat(e.target.value) || 0 })}
                            placeholder="10.00"
                            className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Free Delivery Threshold ({settings.currency})</label>
                        <input
                            type="number"
                            step="0.01"
                            value={settings.free_delivery_threshold}
                            onChange={(e) => updateSettings({ free_delivery_threshold: parseFloat(e.target.value) || 0 })}
                            placeholder="50.00"
                            className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <p className="mt-1 text-xs text-slate-500">Minimum order for free delivery</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                    <input
                        type="checkbox"
                        id="self-pickup"
                        checked={settings.enable_self_pickup}
                        onChange={(e) => updateSettings({ enable_self_pickup: e.target.checked })}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="self-pickup" className="text-sm font-medium text-slate-700 cursor-pointer">
                        Enable Self-Pickup
                    </label>
                </div>
            </div>

            {/* 4. PAYMENT METHODS */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <CreditCard size={20} className="text-blue-600" />
                    Payment Methods
                </h2>
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="cod"
                            checked={settings.accept_cod}
                            onChange={(e) => updateSettings({ accept_cod: e.target.checked })}
                            className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="cod" className="text-sm font-medium text-slate-700 cursor-pointer">
                            Accept Cash on Delivery
                        </label>
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="bank-transfer"
                            checked={settings.accept_bank_transfer}
                            onChange={(e) => updateSettings({ accept_bank_transfer: e.target.checked })}
                            className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="bank-transfer" className="text-sm font-medium text-slate-700 cursor-pointer">
                            Accept Bank Transfer
                        </label>
                    </div>
                    {settings.accept_bank_transfer && (
                        <div className="ml-8 mt-3 space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                            {/* Bank Name */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                    <Building2 size={16} className="text-blue-600" />
                                    Bank Name
                                </label>
                                <input
                                    type="text"
                                    value={settings.bank_name}
                                    onChange={(e) => updateSettings({ bank_name: e.target.value })}
                                    placeholder="e.g. Maybank, CIMB, RHB"
                                    className="w-full md:w-2/3 border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            {/* Account Holder Name */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                    <CreditCard size={16} className="text-green-600" />
                                    Account Holder Name
                                </label>
                                <input
                                    type="text"
                                    value={settings.bank_holder_name}
                                    onChange={(e) => updateSettings({ bank_holder_name: e.target.value })}
                                    placeholder="e.g. BrewCart Sdn Bhd / Ali bin Abu"
                                    className="w-full md:w-2/3 border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            {/* Bank Account Number */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                    <BanknoteIcon size={16} className="text-green-600" />
                                    Bank Account Number
                                </label>
                                <input
                                    type="text"
                                    value={settings.bank_account_number}
                                    onChange={(e) => updateSettings({ bank_account_number: e.target.value })}
                                    placeholder="1234567890"
                                    className="w-full md:w-2/3 border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            {/* DuitNow QR Code Upload */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                    <ImageIcon size={16} className="text-purple-600" />
                                    DuitNow QR Code
                                </label>
                                <p className="text-xs text-slate-500 mb-3">Upload your DuitNow QR so customers can scan & pay directly</p>

                                {settings.qr_code_url ? (
                                    <div className="relative inline-block">
                                        <img
                                            src={settings.qr_code_url}
                                            alt="DuitNow QR Code"
                                            className="w-48 h-48 object-contain rounded-lg border-2 border-purple-200 bg-white p-2 shadow-sm"
                                        />
                                        <button
                                            onClick={() => updateSettings({ qr_code_url: '' })}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => document.getElementById('qr-upload')?.click()}
                                        className="w-48 h-48 border-2 border-dashed border-purple-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-purple-50/50 transition-all"
                                    >
                                        <ImageIcon size={32} className="text-purple-300 mb-2" />
                                        <p className="text-xs text-purple-500 font-medium">Upload QR Code</p>
                                        <p className="text-xs text-slate-400 mt-1">PNG, JPG</p>
                                    </div>
                                )}
                                <input
                                    id="qr-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        if (file.size > 2 * 1024 * 1024) {
                                            toast.error('❌ QR image must be under 2MB');
                                            return;
                                        }
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            updateSettings({ qr_code_url: reader.result as string });
                                            toast.success('✅ QR Code uploaded!');
                                        };
                                        reader.readAsDataURL(file);
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 5. OPERATING HOURS */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div
                    className="p-6 flex justify-between items-center cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => setIsOperatingHoursExpanded(!isOperatingHoursExpanded)}
                >
                    <div className="flex-1">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Clock size={20} className="text-blue-600" />
                            Operating Hours
                        </h2>
                        {!isOperatingHoursExpanded && (
                            <p className="text-sm text-slate-500 mt-1 ml-7">{getOperatingHoursSummary()}</p>
                        )}
                    </div>
                    {isOperatingHoursExpanded ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                </div>

                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOperatingHoursExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="p-6 pt-0 space-y-3 border-t border-slate-100">
                        {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const).map((day) => (
                            <div key={day} className="flex items-center gap-4 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                                <div className="w-24 font-medium text-slate-700 capitalize">{day}</div>
                                <div className="flex items-center gap-3 flex-1">
                                    <input
                                        type="time"
                                        value={settings.operating_hours[day].open}
                                        onChange={(e) => updateOperatingHours(day, 'open', e.target.value)}
                                        disabled={settings.operating_hours[day].closed}
                                        className="border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-100"
                                    />
                                    <span className="text-slate-500">to</span>
                                    <input
                                        type="time"
                                        value={settings.operating_hours[day].close}
                                        onChange={(e) => updateOperatingHours(day, 'close', e.target.value)}
                                        disabled={settings.operating_hours[day].closed}
                                        className="border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-100"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id={`closed-${day}`}
                                        checked={settings.operating_hours[day].closed}
                                        onChange={(e) => updateOperatingHours(day, 'closed', e.target.checked)}
                                        className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
                                    />
                                    <label htmlFor={`closed-${day}`} className="text-sm text-slate-600 cursor-pointer">
                                        Closed
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 6. NOTIFICATIONS */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Bell size={20} className="text-blue-600" />
                    Notifications
                </h2>
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="whatsapp-notifications"
                        checked={settings.whatsapp_order_notifications}
                        onChange={(e) => updateSettings({ whatsapp_order_notifications: e.target.checked })}
                        className="w-5 h-5 rounded border-slate-300 text-green-600 focus:ring-green-500"
                    />
                    <div>
                        <label htmlFor="whatsapp-notifications" className="text-sm font-medium text-slate-700 cursor-pointer block">
                            WhatsApp Order Notifications
                        </label>
                        <p className="text-xs text-slate-500 mt-1">Get notified on WhatsApp when new orders arrive</p>
                    </div>
                </div>
            </div>

            {/* SAVE BUTTON */}
            <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 -mx-6 -mb-8 mt-6 z-10">
                <button
                    onClick={handleSave}
                    disabled={saveLoading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg text-base font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 transition-all"
                >
                    {saveLoading ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save size={18} />
                            Save Settings
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
