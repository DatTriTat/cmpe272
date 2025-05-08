import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { onAuthStateChanged, getIdToken, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { BASE_URL } from "../config/config";
interface UserProfile {
  fullName?: string;
  jobTitle?: string;
  phone?: string;
  location?: string;
  summary?: string;
  objective?: string;
  desiredRole?: string;
  desiredSalary?: string;
  workType?: string;
  availability?: string;
  skills?: any[];
  experiences?: any[];
  educations?: any[];
}
import { withKongKey } from "../utils/authHeaders";

interface User {
  uid: string;
  email: string;
  role?: string;
  provider?: string;
  name?: string;
  token?: string;
  profile?: UserProfile;
}

// Define the context value type
interface AuthContextType {
  user: User | null;
  logout: () => void;
  loading: boolean;
  setUser: (user: User) => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const idToken = await getIdToken(firebaseUser);
        const res = await fetch(`${BASE_URL}/api/auth/verify`, {
          method: "POST",
          headers: withKongKey({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({ idToken }),
        });
        if (res.status === 401) {
          console.warn("Token invalid or expired. Logging out...");
          await signOut(auth);
          setUser(null);
          localStorage.clear();
          return;
        }
        const userInfo: User = await res.json();
        setUser(userInfo);
        console.log("User info:", userInfo);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, logout, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
