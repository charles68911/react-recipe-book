import { createContext } from "react";
import type { User } from "@/services/auth-service";

// The values and functions that any component can read through useAuth().
type AuthContextValue = {
  user: User | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (name: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
};

// Context lets pages share authentication without passing props through each level.
export const AuthContext = createContext<AuthContextValue | null>(null);