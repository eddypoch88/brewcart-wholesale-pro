import { useState, useEffect } from 'react';
import { db } from '../shared/firebase-config';
import { collection, onSnapshot, query, orderBy, doc } from 'firebase/firestore';

export const useFirestoreCollection = (collectionName: string) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            // Create query. Note: indices might be required for specific ordering
            const colRef = collection(db, collectionName);
            // Fallback in case orderBy causes index issues initially, we can wrap in try/catch or just simple query
            // For now, following user request strictly but ensuring import is correct
            const q = query(colRef, orderBy('createdAt', 'desc'));

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setData(docs);
                setLoading(false);
            });
            return () => unsubscribe();
        } catch (error) {
            console.error("Firestore Hook Error:", error);
            setLoading(false);
        }
    }, [collectionName]);

    return { data, loading };
};

export const useFirestoreDocument = (collectionName: string, docId: string) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!docId) return;
        setLoading(true);
        // doc needs to be imported from 'firebase/firestore'
        const unsubscribe = onSnapshot(doc(db, collectionName, docId), (docSnapshot) => {
            if (docSnapshot.exists()) {
                setData({ id: docSnapshot.id, ...docSnapshot.data() });
            } else {
                setData(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [collectionName, docId]);

    return { data, loading };
};
