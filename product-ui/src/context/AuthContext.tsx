import React, { createContext, useState, useContext, useEffect } from "react";
import { apiService } from "../services/api";

interface User {
  id: number;
  username: string;
}

interface AuthContextData {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loadStoredData = () => {
      const storedToken = localStorage.getItem("@App:token");
      const storedUser = localStorage.getItem("@App:user");

      if (storedToken && storedUser) {
        try {
          setIsAuthenticated(true);
          setUser(JSON.parse(storedUser));
          console.log("User session restored from storage");
        } catch (error) {
          console.error("Error parsing stored user data:", error);
          // Clear invalid data
          localStorage.removeItem("@App:token");
          localStorage.removeItem("@App:user");
        }
      }
    };

    loadStoredData();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const { token, user } = await apiService.login(username, password);

      if (!token || !user) {
        throw new Error("Invalid authentication data received from server");
      }

      localStorage.setItem("@App:token", token);
      localStorage.setItem("@App:user", JSON.stringify(user));

      setUser(user);
      setIsAuthenticated(true);
      console.log("Login successful for user:", username);
    } catch (error: any) {
      console.error("Login error in AuthContext:", error);
      if (error.response && error.response.status === 401) {
        throw new Error("Invalid username or password");
      }
      throw error;
    }
  };

  const logout = () => {
    try {
      apiService.logout();
      localStorage.removeItem("@App:token");
      localStorage.removeItem("@App:user");
      setUser(null);
      setIsAuthenticated(false);
      console.log("Logout successful");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
