import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';

export const registerAPI = async (email, password, name) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const { user } = userCredential;

  await updateProfile(user, { displayName: name });

  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email: user.email,
    fullname: name,
    avatar: '',
      role: 'USER',
    phone: '',
    address: '',
    createdAt: serverTimestamp(),
  });

  const token = await user.getIdToken();
  return { user, token };
};

export const loginAPI = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const { user } = userCredential;
  const token = await user.getIdToken();
  return { user, token };
};

export const loginWithGoogleAPI = async () => {
  const userCredential = await signInWithPopup(auth, googleProvider);
  const { user } = userCredential;
  const token = await user.getIdToken();

  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      fullname: user.displayName || 'User',
      avatar: user.photoURL || '',
      role: 'USER',
      phone: '',
      address: '',
      createdAt: serverTimestamp(),
    });
  }

  return { user, token };
};

export const logoutAPI = async () => {
  await signOut(auth);
};

export const resetPasswordAPI = async (email) => {
  await sendPasswordResetEmail(auth, email);
};

export const subscribeAuthChange = (callback) => onAuthStateChanged(auth, callback);

export const getUserProfile = async (uid) => {
  const userSnap = await getDoc(doc(db, 'users', uid));
  if (userSnap.exists()) {
    return { id: userSnap.id, ...userSnap.data() };
  }
  return null;
};