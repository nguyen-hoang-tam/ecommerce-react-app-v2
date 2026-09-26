import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const getProductsAPI = async () => {
  const snapshot = await getDocs(collection(db, 'products'));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};