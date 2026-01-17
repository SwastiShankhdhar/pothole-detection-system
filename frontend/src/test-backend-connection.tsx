// Add this temporarily to your main.tsx or create a test button
import { testConnection } from "@/lib/api";

async function testBackend() {
  console.log("Testing backend connection...");
  const result = await testConnection();
  console.log("Backend test result:", result);
  
  if (result.success) {
    alert("✅ Backend is connected!");
  } else {
    alert("❌ Backend connection failed: " + result.error);
  }
}

// You can call this function from browser console
(window as any).testBackend = testBackend;