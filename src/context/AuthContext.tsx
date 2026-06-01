import { useState, useEffect, createContext, useContext, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users database
const DEMO_USERS = [
  { id: '1', name: 'Admin User', email: 'admin@stockflow.com', password: 'admin123', role: 'Administrator', avatar: '👨‍💼' },
  { id: '2', name: 'Sarah Manager', email: 'sarah@stockflow.com', password: 'sarah123', role: 'Warehouse Manager', avatar: '👩‍💻' },
  { id: '3', name: 'John Staff', email: 'john@stockflow.com', password: 'john123', role: 'Inventory Clerk', avatar: '👨‍🔧' },
];

export function AuthProvider({ children }: { children: React.ReactElement }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('stockflow_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const foundUser = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      const userData: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        avatar: foundUser.avatar,
      };
      setUser(userData);
      localStorage.setItem('stockflow_user', JSON.stringify(userData));
      setIsLoading(false);
      return { success: true };
    }

    setIsLoading(false);
    return { success: false, error: 'Invalid email or password. Please try again.' };
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const exists = DEMO_USERS.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (exists) {
      setIsLoading(false);
      return { success: false, error: 'An account with this email already exists.' };
    }

    if (password.length < 6) {
      setIsLoading(false);
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const newUser: User = {
      id: String(DEMO_USERS.length + 1),
      name,
      email,
      role: 'Inventory Clerk',
      avatar: '👤',
    };
    setUser(newUser);
    localStorage.setItem('stockflow_user', JSON.stringify(newUser));
    setIsLoading(false);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('stockflow_user');
  }, []);

  const resetPassword = useCallback(async (_email: string) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { success: true };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
