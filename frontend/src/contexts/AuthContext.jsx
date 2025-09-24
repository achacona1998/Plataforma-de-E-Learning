import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Fetch user profile using the token
          const response = await fetch(
            "http://localhost:5000/api/auth/perfil",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            // If token is invalid, remove it
            localStorage.removeItem("token");
            setUser(null);
            setLoading(false);
            return;
          }

          const data = await response.json();
          setUser(data.data.usuario);
        } catch (error) {
          console.error("Token validation error:", error);
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false);
    };

    validateToken();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      setUser(data.data.usuario);
      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const register = async (userData) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      localStorage.setItem("token", data.token);
      setUser(data.data.usuario);
      return data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const getUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return null;
      }

      const response = await fetch("http://localhost:5000/api/auth/perfil", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const data = await response.json();
      return data.data.usuario;
    } catch (error) {
      console.error("Get profile error:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    getUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
