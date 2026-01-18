// frontend/src/lib/api.ts
import { fetchApi } from "@/lib/fetch-api";

/* ===============================
   AUTHORITY API (OTP ONLY)
================================ */
export const authorityApi = {
  sendOTP: (email: string, captchaText: string) =>
    fetchApi.authority.sendOTP(email, captchaText),

  verifyOTP: (email: string, otp: string, captchaInput: string) =>
    fetchApi.authority.verifyOTP(email, otp, captchaInput),

  signup: (data: {
    email: string;
    name: string;
    designation: string;
    department: string;
    password: string;
  }) =>
    fetchApi.authority.signup(data),
};

/* ===============================
   CITIZEN API
================================ */
export const citizenApi = {
  sendOTP: (phone: string, captchaText: string) =>
    fetchApi.citizen.sendOTP(phone, captchaText),

  verifyOTP: (
    phone: string,
    otp: string,
    captchaInput: string,
    name?: string
  ) =>
    fetchApi.citizen.verifyOTP(phone, otp, captchaInput, name),
};

/* ===============================
   HEALTH CHECK
================================ */
export const checkBackendHealth = async () => {
  try {
    await fetch("http://localhost:8000/api/health");
    return true;
  } catch {
    return false;
  }
};
