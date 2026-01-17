import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Add interceptors for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status}`, response.data);
    return response;
  },
  (error) => {
    console.error("[API Error]", {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

// Citizen API functions
export const citizenApi = {
  sendOTP: async (phoneNumber: string) => {
    try {
      const response = await api.post("/citizen/send-otp", {
        phone_number: phoneNumber,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail || 
        error.response?.data?.error || 
        "Failed to send OTP"
      );
    }
  },

  verifyOTP: async (phoneNumber: string, otp: string, fullName: string) => {
    try {
      const response = await api.post("/citizen/verify-otp", {
        phone_number: phoneNumber,
        otp: otp,
        full_name: fullName,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail || 
        error.response?.data?.error || 
        "Failed to verify OTP"
      );
    }
  },
};

// Authority API functions
export const authorityApi = {
  signup: async (data: {
    email: string;
    full_name: string;
    designation: string;
    department: string;
    password: string;
  }) => {
    try {
      const response = await api.post("/authority/signup", data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail || 
        "Failed to sign up"
      );
    }
  },

  verify: async (token: string) => {
    try {
      const response = await api.get(`/authority/verify?token=${token}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail || 
        "Failed to verify email"
      );
    }
  },
};

// Test connection
export const testConnection = async () => {
  try {
    const response = await api.get("/");
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Connection failed" 
    };
  }
};

// Utility to check if backend is running
export const checkBackendHealth = async () => {
  try {
    await api.get("/health");
    return true;
  } catch {
    return false;
  }
};

export default api;