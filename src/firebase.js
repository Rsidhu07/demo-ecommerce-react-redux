import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";



const firebaseConfig = {
    apiKey: "AIzaSyBSdDjCa3GH6dS0AwroTwO30v6_npfOMt4",
    authDomain: "fir-ecomm-9c279.firebaseapp.com",
    projectId: "fir-ecomm-9c279",
    storageBucket: "fir-ecomm-9c279.appspot.com",
    messagingSenderId: "189198928652",
    appId: "1:189198928652:web:0a8f9f2f2bf8c5c44cd729",
    measurementId: "G-YW1KGMZTKK"
  };

  firebase.initializeApp(firebaseConfig);


  export const generateUserDocument = async (user, additionalData) => {
    if (!user) return;
    const userRef = firestore.doc(`users/${user.uid}`);
    const snapshot = await userRef.get();
    if (!snapshot.exists) {
      const { email} = user;
      try {
        await userRef.set({
          
            email,
            ...additionalData
        });

      } catch (error) {
        console.error("Error creating user document", error);
      }
    }
    return getUserDocument(user.uid);
  };

  const getUserDocument = async uid => {
    if (!uid) return null;
    try {
      const userDocument = await firestore.doc(`users/${uid}`).get();
      return {
        uid,
        ...userDocument.data()
      };
    } catch (error) {
      console.error("Error fetching user", error);
    }
  };

export const auth = firebase.auth();
export const firestore = firebase.firestore();