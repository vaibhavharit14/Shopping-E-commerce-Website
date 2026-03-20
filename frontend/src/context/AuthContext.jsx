import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    // Clear user and token on fresh app mount to ensure manual login
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  const login = async (email, password, socialUserData = null) => {
    try {
      if (socialUserData) {
        // Handle Google Auth by syncing with backend to get a real token
        const response = await axios.post(`${backendUrl}/api/auth/social-login`, { 
          email: socialUserData.email, 
          name: socialUserData.name 
        });
        const userData = response.data;
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", userData.token);
        return userData;
      }


      // Standard Login
      const response = await axios.post(`${backendUrl}/api/auth/login`, { email, password });
      const userData = response.data;
      
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", userData.token);
      return userData;
    } catch (error) {
      console.error("Auth Error:", error);
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${backendUrl}/api/auth/register`, { name, email, password });
      const userData = response.data;
      
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", userData.token);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  const updatePassword = async (oldPassword, newPassword) => {
    return { success: true, message: "Endpoint pending implementation" };
  }

  const sendOTP = async (phone) => {
    return { success: true, otp: "123456" };
  }

  const verifyOTPAndChangePassword = async (otp, newPassword) => {
    if (otp === "123456") return { success: true, message: "Success" };
    return { success: false, message: "Invalid OTP" };
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updatePassword, sendOTP, verifyOTPAndChangePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
