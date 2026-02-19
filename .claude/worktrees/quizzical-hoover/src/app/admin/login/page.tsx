import React, { useState } from "react";

// Adapted for Vite environment
export default function AdminLogin({ onLoginSuccess }: { onLoginSuccess: () => void }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // Logic "Master Key"
        if (username === "admin" && password === "12345678") {
            // Simpan "session" dlm localStorage
            localStorage.setItem("isAdmin", "true");
            onLoginSuccess(); // Trigger navigation/state update
        } else {
            setError("Salah kunci bosku! Client lain dilarang masuk ❌");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
                <h1 className="mb-6 text-center text-2xl font-bold text-slate-800">Orb Empire Admin 🚀</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
                            placeholder="Masukkan username"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
                            placeholder="12345678"
                        />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <button type="submit" className="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700">
                        Masuk Sekarang
                    </button>
                </form>
            </div>
        </div>
    );
}
