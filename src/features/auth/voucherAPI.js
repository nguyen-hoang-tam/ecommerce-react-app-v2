import { collection, getDocs, query, where, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const getVouchersAPI = async () => {
  const q = query(
    collection(db, 'vouchers'),
    where('isActive', '==', true)
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
};


export const getVoucherByCodeAPI = async (code) => {
  const q = query(
    collection(db, 'vouchers'),
    where('code', '==', code),
    where('isActive', '==', true)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  return {
    id: snapshot.docs[0].id,
    ...snapshot.docs[0].data(),
  };
};

export const updateVoucherUsageAPI = async (id) => {
  const ref = doc(db, 'vouchers', id);
  await updateDoc(ref, {
    usageCount: increment(1),
  });
};