import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";

/**
 * Signup user with email and password
 * @param email - user's email
 * @param password - user's password
 */
export async function firebaseSignup(email: string, password: string): Promise<string> {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  return userCred.user.getIdToken();
}

/**
 * Login user with email and password
 * @param email - user's email
 * @param password - user's password
 */
export async function firebaseLogin(email: string, password: string): Promise<string> {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  return userCred.user.getIdToken();
}

/**
 * Login user with Google popup
 */
export async function firebaseGoogleLogin(): Promise<string> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user.getIdToken();
}
