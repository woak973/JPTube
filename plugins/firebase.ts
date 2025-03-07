import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyBraVa_zuCyIno1p4_6oVdfQcaxRheuD8k',
    authDomain: 'woak973.firebaseapp.com',
    projectId: 'woak973',
    storageBucket: 'woak973.firebasestorage.app',
    messagingSenderId: '325953869152',
    appId: '1:325953869152:web:e25495c0d803ebffacfa05',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;