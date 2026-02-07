"use client";
import React, { useState } from 'react';
import { Zap, Minus, Plus, X, ChevronRight, User, MapPin, Mail, CreditCard, QrCode, Smartphone } from 'lucide-react';

// --- 1. ICON WHATSAPP REAL (SVG) ---
const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
);

interface ProductBottomBarProps {
    productName: string;
    price: number;
    phone: string;
}

export default function ProductBottomBar({ productName, price, phone }: ProductBottomBarProps) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // --- STATE UNTUK MULTI-STEP ---
    const [currentStep, setCurrentStep] = useState(1); // 1=Qty, 2=Form, 3=Payment
    const [quantity, setQuantity] = useState(1);
    const [formData, setFormData] = useState({ name: '', email: '', address: '' });
    const [paymentMethod, setPaymentMethod] = useState<'whatsapp' | 'fpx' | 'qr' | null>(null);

    const totalPrice = price * quantity;

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('ms-MY', { style: 'currency', currency: 'MYR', minimumFractionDigits: 0 }).format(amount);
    };

    // Handle Form Input
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Reset bila tutup drawer
    const closeDrawer = () => {
        setIsDrawerOpen(false);
        setCurrentStep(1); // Reset balik ke step 1
    };

    // Logic "Tanya Dulu"
    const handleChat = () => {
        const message = `Hi, saya ada soalan pasal *${productName}*. Boleh bantu?`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    // --- FINAL STEP: CHECKOUT (Hantar ke WhatsApp) ---
    const handleCheckout = () => {
        if (!paymentMethod) return alert("Sila pilih cara bayaran.");

        // Nama payment method yang bersih untuk mesej WhatsApp
        let paymentText = "";
        if (paymentMethod === 'whatsapp') paymentText = "Manual Transfer (WhatsApp)";
        if (paymentMethod === 'fpx') paymentText = "Online Banking (FPX)";
        if (paymentMethod === 'qr') paymentText = "DuitNow QR";

        const message = `Hi, saya nak checkout order ni:\n\n📦 *${productName}*\n🔢 Kuantiti: *${quantity} unit*\n💰 Total: *${formatMoney(totalPrice)}*\n\n👤 *Maklumat Pelanggan:*\nNama: ${formData.name}\nEmail: ${formData.email}\nAlamat: ${formData.address}\n\n💳 *Pilihan Bayaran:* ${paymentText}\n\nMohon proceed untuk pembayaran.`;

        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
        closeDrawer();
    };


    return (
        <>
            {/* --- LAYER 1: STICKY BAR --- */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 pb-safe z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                <div className="flex gap-3 max-w-md mx-auto">
                    {/* Butang Kiri: TANYA */}
                    <button onClick={handleChat} className="flex flex-col items-center justify-center w-[25%] p-2 rounded-xl bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 transition-colors">
                        <WhatsAppIcon className="w-6 h-6 mb-0.5 stroke-current" />
                        <span className="text-[10px] font-bold">Tanya</span>
                    </button>

                    {/* Butang Kanan: BELI (Gradient) */}
                    <button
                        onClick={() => setIsDrawerOpen(true)}
                        className="flex-1 flex items-center justify-between px-5 bg-gradient-to-r from-rose-600 to-orange-500 text-white rounded-xl shadow-lg shadow-rose-200/50 hover:from-rose-700 hover:to-orange-600 active:scale-[0.98] transition-all"
                    >
                        <span className="text-xs font-medium text-white/90">Total: {formatMoney(price)}</span>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-sm">BELI SEKARANG</span>
                            <Zap className="w-4 h-4 fill-current animate-pulse" />
                        </div>
                    </button>
                </div>
            </div>

            {/* --- LAYER 2: MULTI-STEP DRAWER --- */}
            {isDrawerOpen && (
                <>
                    <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm transition-opacity" onClick={closeDrawer} />
                    <div className="fixed bottom-0 left-0 right-0 z-[60] bg-white rounded-t-3xl p-5 pb-8 animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto">
                        <div className="max-w-md mx-auto space-y-6">

                            {/* Header Drawer & Close Button */}
                            <div className="flex items-center justify-between">
                                {/* Step Indicator */}
                                <div className="flex gap-1">
                                    {[1, 2, 3].map(step => (
                                        <div key={step} className={`h-2 w-8 rounded-full ${currentStep >= step ? 'bg-rose-600' : 'bg-slate-200'}`} />
                                    ))}
                                </div>
                                <button onClick={closeDrawer} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                                    <X className="w-5 h-5 text-slate-600" />
                                </button>
                            </div>


                            {/* --- KONTEN STEP 1: PILIH KUANTITI --- */}
                            {currentStep === 1 && (
                                <div className="space-y-6 animate-in fade-in">
                                    <div><h3 className="font-bold text-slate-800 text-lg">Berapa unit boss?</h3><p className="text-sm text-slate-500">{productName}</p></div>
                                    <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <span className="text-sm font-medium text-slate-600">Kuantiti:</span>
                                        <div className="flex items-center gap-4 bg-white px-2 py-1 rounded-xl shadow-sm border border-slate-200">
                                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:text-rose-600 disabled:opacity-50" disabled={quantity <= 1}><Minus className="w-5 h-5" /></button>
                                            <span className="font-bold text-lg w-8 text-center">{quantity}</span>
                                            <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:text-green-600"><Plus className="w-5 h-5" /></button>
                                        </div>
                                    </div>
                                    <button onClick={() => setCurrentStep(2)} className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-800">
                                        Isi Maklumat <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}


                            {/* --- KONTEN STEP 2: ISI BORANG --- */}
                            {currentStep === 2 && (
                                <div className="space-y-4 animate-in fade-in">
                                    <div><h3 className="font-bold text-slate-800 text-lg">Maklumat Penghantaran</h3><p className="text-sm text-slate-500">Ke mana kami perlu hantar?</p></div>
                                    <div className="space-y-3">
                                        <div className="relative"><User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" /><input type="text" name="name" placeholder="Nama Penuh" value={formData.name} onChange={handleInputChange} className="w-full pl-10 p-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-0 outline-none" /></div>
                                        <div className="relative"><Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" /><input type="email" name="email" placeholder="Alamat Email (Optional)" value={formData.email} onChange={handleInputChange} className="w-full pl-10 p-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-0 outline-none" /></div>
                                        <div className="relative"><MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" /><textarea name="address" placeholder="Alamat Lengkap" value={formData.address} onChange={handleInputChange} rows={3} className="w-full pl-10 p-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-0 outline-none resize-none" /></div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => setCurrentStep(1)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl">Back</button>
                                        <button onClick={() => { if (!formData.name || !formData.address) return alert('Isi nama & alamat dlu boss'); setCurrentStep(3) }} className="flex-[2] py-3 bg-slate-900 text-white font-bold rounded-xl">Pilih Bayaran</button>
                                    </div>
                                </div>
                            )}


                            {/* --- KONTEN STEP 3: PILIH PAYMENT (UPDATE D SINI) --- */}
                            {currentStep === 3 && (
                                <div className="space-y-6 animate-in fade-in">
                                    <div><h3 className="font-bold text-slate-800 text-lg">Cara Pembayaran</h3><p className="text-sm text-slate-500">Total perlu bayar: <span className="font-bold text-rose-600">{formatMoney(totalPrice)}</span></p></div>

                                    {/* 3 Column Payment Grid (Updated Labels) */}
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            // UPDATE LABEL D SINI
                                            { id: 'whatsapp', icon: Smartphone, label: 'WhatsApp Payment', color: 'border-green-500 bg-green-50 text-green-700' },
                                            { id: 'fpx', icon: CreditCard, label: 'FPX Payment', color: 'border-blue-500 bg-blue-50 text-blue-700' },
                                            { id: 'qr', icon: QrCode, label: 'QR Payment', color: 'border-purple-500 bg-purple-50 text-purple-700' },
                                        ].map((method) => (
                                            <button
                                                key={method.id}
                                                onClick={() => setPaymentMethod(method.id as any)}
                                                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${paymentMethod === method.id ? method.color : 'border-slate-200 bg-white text-slate-500 grayscale hover:grayscale-0'}`}
                                            >
                                                <method.icon className="w-8 h-8 mb-2" />
                                                <span className="text-[10px] font-bold text-center leading-tight">{method.label}</span>
                                            </button>
                                        ))}
                                    </div>

                                    {/* UPDATE BUTTON LABEL JADI "Checkout" */}
                                    <button onClick={handleCheckout} disabled={!paymentMethod} className="w-full py-4 bg-gradient-to-r from-rose-600 to-orange-500 text-white font-bold text-lg rounded-2xl shadow-xl shadow-rose-200/50 hover:from-rose-700 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                        <span>Checkout</span>
                                        <span className="bg-white/20 px-2 py-0.5 rounded text-sm">{formatMoney(totalPrice)}</span>
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>
                </>
            )}
        </>
    );
}
