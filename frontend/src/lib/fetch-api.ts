// Simple fetch-based API client (no axios needed)
const API_BASE = 'http://localhost:8000/api';

export const fetchApi = {
  // Authority endpoints
  authority: {
    sendOTP: async (email: string, captchaText: string) => {
      const response = await fetch(`${API_BASE}/authority/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, captcha_text: captchaText })
      });
      return response.json();
    },

    verifyOTP: async (email: string, otp: string, captchaInput: string) => {
      const response = await fetch(`${API_BASE}/authority/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          otp, 
          captcha_input: captchaInput 
        })
      });
      return response.json();
    },

    signup: async (data: any) => {
      const response = await fetch(`${API_BASE}/authority/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    }
  },

  // Citizen endpoints (for later)
  citizen: {
    sendOTP: async (phone: string, captchaText: string) => {
      const response = await fetch(`${API_BASE}/citizen/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, captcha_text: captchaText })
      });
      return response.json();
    },

    verifyOTP: async (phone: string, otp: string, captchaInput: string, name?: string) => {
      const response = await fetch(`${API_BASE}/citizen/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone, 
          otp, 
          captcha_input: captchaInput,
          full_name: name 
        })
      });
      return response.json();
    }
  }
};