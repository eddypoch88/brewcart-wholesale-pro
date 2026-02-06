import React, { useState } from 'react';
import { db } from '../src/shared/firebase-config';
import { collection, addDoc } from 'firebase/firestore';
import { CheckCircle, AlertCircle, Loader2, CloudLightning } from 'lucide-react';

export default function TestConnectionButton() {
    const [loading, setLoading] = useState(false);

    const handleTestConnection = async () => {
        setLoading(true);
        try {
            await addDoc(collection(db, 'test_connection'), {
                message: 'Lekat 100%!',
                sender: 'Postman',
                timestamp: new Date()
            });

            alert('Data Sent to Cloud!');
            console.log('Test connection successful: Document written to connection_tests');
        } catch (e) {
            console.error('Error adding document: ', e);
            alert('Error sending data to cloud');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleTestConnection}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg active:scale-95"
        >
            {loading ? (
                <>
                    <Loader2 size={14} className="animate-spin" />
                    Sending...
                </>
            ) : (
                <>
                    <CloudLightning size={14} />
                    TEST CLOUD SYNC
                </>
            )}
        </button>
    );
}
