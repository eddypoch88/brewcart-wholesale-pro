import React from 'react';
import { Loader2 } from 'lucide-react'; // Icon loading pusing-pusing

interface PrimaryButtonProps {
    children: React.ReactNode;      // Teks dalam button (contoh: "Save")
    onClick?: () => void;           // Apa jadi bila tekan
    loading?: boolean;              // Tengah loading ka?
    type?: "button" | "submit";     // Jenis button
    className?: string;             // Kalau nak tambah style extra
    icon?: React.ReactNode;         // Kalau ada icon (contoh: Globe)
}

export default function PrimaryButton({
    children,
    onClick,
    loading = false,
    type = "button",
    className = "",
    icon
}: PrimaryButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={loading}
            className={`
        flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white 
        bg-black rounded-lg hover:bg-gray-800 transition-all shadow-sm
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
        >
            {loading ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                </>
            ) : (
                <>
                    {icon && <span>{icon}</span>}
                    {children}
                </>
            )}
        </button>
    );
}
