// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Firestore, getFirestore } from "firebase/firestore";
import firebase from "firebase/compat/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "health-hustle-happiness.firebaseapp.com",
  projectId: "health-hustle-happiness",
  storageBucket: "health-hustle-happiness.appspot.com",
  messagingSenderId: "1027307149116",
  appId: "1:1027307149116:web:92c82ae9720260dddaf039",
  measurementId: "G-VJFENP45L2",
};

let isConnected = false; // Variable to track the connection status
const app = initializeApp(firebaseConfig);
export const analytics = () => {
  if (typeof window !== "undefined") {
    return firebase.analytics();
  } else {
    return null;
  }
};

export const getFirebaseDB = (): Firestore | undefined => {
  if (!process.env.FIREBASE_API_KEY && !process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    console.log("FIREBASE_API_KEY and NEXT_PUBLIC_FIREBASE_API_KEY are not defined in .env");
    return;
  }
  // if (isConnected) {
  //   console.log("=> using existing database connection");
  //   return;
  // }

  try {
    // Initialize Firebase

    const db = getFirestore(app);

    // isConnected = true;
    console.log("INFO: Firebase Connected");
    return db;
  } catch (error) {
    console.log("ERROR: Firebase Connection Failed");
    console.log(error);
    return;
  }
};
