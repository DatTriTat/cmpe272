import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
  } from "firebase/auth";
  import { auth, googleProvider } from "../firebase";
  
  export async function firebaseSignup(email, password) {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    return userCred.user.getIdToken();
  }
  
  export async function firebaseLogin(email, password) {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    return userCred.user.getIdToken();
  }
  
  export async function firebaseGoogleLogin() {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user.getIdToken();
  }
  