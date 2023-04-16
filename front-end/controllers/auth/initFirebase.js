import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBRj7YneDoaXByEBABt-vYF-gDqFuR2XmM",
  authDomain: "tutor4330-da562.firebaseapp.com",
  projectId: "tutor4330-da562",
  storageBucket: "tutor4330-da562.appspot.com",
  messagingSenderId: "462743581419",
  appId: "1:462743581419:web:f60072a6b13a23cf4f84ae",
  databaseURL: "https://tutor4330-da562-default.firebaseio.com/"
};
  
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
