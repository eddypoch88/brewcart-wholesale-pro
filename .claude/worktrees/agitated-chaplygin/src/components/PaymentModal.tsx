"use client";
import React, { useState, useEffect } from 'react';
import { X, Copy, CheckCircle2, Download, Share2 } from 'lucide-react';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    amount: number;
    orderDetails: {
        productName: string;
        quantity: number;
        customerName: string;
    };
}

export default function PaymentModal({ isOpen, onClose, amount, orderDetails }: PaymentModalProps) {
    const [copied, setCopied] = useState(false);
    const [paymentConfirmed, setPaymentConfirmed] = useState(false);

    // Format amount untuk display
    const formatMoney = (amt: number) => {
        return new Intl.NumberFormat('ms-MY', { style: 'currency', currency: 'MYR', minimumFractionDigits: 2 }).format(amt);
    };

    // DuitNow QR Data (placeholder - ganti dengan QR code sebenar nanti)
    // Format: https://duitnow.my/qr/{accountId}?amount={amount}
    const duitnowAccount = "0123456789"; // GANTI NI DENGAN ACCOUNT SEBENAR
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://duitnow.my/${duitnowAccount}?amount=${amount}`;

    // Copy account number
    const handleCopyAccount = () => {
        navigator.clipboard.writeText(duitnowAccount);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Download QR code
    const handleDownloadQR = () => {
        const link = document.createElement('a');
        link.href = qrCodeUrl;
        link.download = `payment-qr-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Share (untuk mobile)
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Payment QR Code',
                    text: `Bayaran untuk ${orderDetails.productName} - ${formatMoney(amount)}`,
                    url: qrCodeUrl
                });
            } catch (err) {
                console.log('Share cancelled');
            }
        }
    };

    // Confirm payment (close modal & trigger success)
    const handleConfirmPayment = () => {
        setPaymentConfirmed(true);
        setTimeout(() => {
            onClose();
            // TODO: Trigger order submission to database/WhatsApp
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/70 z-[200] backdrop-blur-sm animate-in fade-in" onClick={onClose} />

            {/* Modal */}
            <div className="fixed inset-x-0 top-[10%] z-[201] max-w-lg mx-auto animate-in slide-in-from-top duration-300">
                <div className="bg-white rounded-3xl shadow-2xl mx-4 overflow-hidden">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white relative">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-2xl font-bold mb-1">Scan & Bayar</h2>
                        <p className="text-purple-100 text-sm">DuitNow QR Payment</p>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">

                        {/* Order Summary */}
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wide">Order Details</p>
                                    <p className="font-bold text-slate-800 mt-1">{orderDetails.productName}</p>
                                    <p className="text-sm text-slate-600">Qty: {orderDetails.quantity} unit</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500">Total Bayaran</p>
                                    <p className="text-2xl font-bold text-purple-600">{formatMoney(amount)}</p>
                                </div>
                            </div>
                        </div>

                        {/* QR Code */}
                        <div className="flex flex-col items-center">
                            <div className="bg-white p-4 rounded-2xl shadow-lg border-4 border-purple-100">
                                <img
                                    src={qrCodeUrl}
                                    alt="DuitNow QR Code"
                                    className="w-64 h-64 object-contain"
                                />
                            </div>
                            <p className="text-sm text-slate-500 mt-3 text-center">
                                Scan QR code guna <span className="font-bold">banking app</span> awak
                            </p>
                        </div>

                        {/* Manual Account (Alternative) */}
                        <div className="border-t border-slate-200 pt-4">
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Atau transfer manual ke:</p>
                            <div className="flex items-center justify-between bg-purple-50 border border-purple-200 rounded-xl p-3">
                                <div>
                                    <p className="text-xs text-purple-600 font-medium">DuitNow ID</p>
                                    <p className="font-mono font-bold text-slate-800">{duitnowAccount}</p>
                                </div>
                                <button
                                    onClick={handleCopyAccount}
                                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                                >
                                    {copied ? (
                                        <>
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" />
                                            <span>Copy</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={handleDownloadQR}
                                className="flex-1 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                <span>Download</span>
                            </button>
                            {navigator.share && (
                                <button
                                    onClick={handleShare}
                                    className="flex-1 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Share2 className="w-4 h-4" />
                                    <span>Share</span>
                                </button>
                            )}
                        </div>

                        {/* Confirm Payment Button */}
                        {paymentConfirmed ? (
                            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center justify-center gap-3 text-green-700">
                                <CheckCircle2 className="w-6 h-6" />
                                <span className="font-bold">Payment Confirmed! ✓</span>
                            </div>
                        ) : (
                            <button
                                onClick={handleConfirmPayment}
                                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-2xl shadow-xl shadow-purple-200/50 hover:from-purple-700 hover:to-pink-700 transition-all"
                            >
                                Dah Bayar? Confirm Order
                            </button>
                        )}

                        {/* Disclaimer */}
                        <p className="text-xs text-center text-slate-400 leading-relaxed">
                            Selepas bayar, tekan butang "Confirm Order" untuk sahkan pesanan.
                            Order details akan dihantar ke admin untuk processing.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
