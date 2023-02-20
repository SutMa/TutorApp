import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB8Sk1XUpcVA43IbKVqHIwoaA_KvTBTw4s",
    authDomain: "csc4330projectgroupc.firebaseapp.com",
    projectId: "csc4330projectgroupc",
    storageBucket: "csc4330projectgroupc.appspot.com",
    messagingSenderId: "256165131370",
    appId: "1:256165131370:web:51ea87a5f752faf7fa8613",
    measurementId: "G-YEYY42X2TL"
  };
  
const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
