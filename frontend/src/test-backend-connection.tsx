async function testBackend() {
  try {
    const res = await fetch("http://localhost:8000/api/health");
    if (!res.ok) throw new Error("Health check failed");
    alert("✅ Backend connected");
  } catch (e) {
    alert("❌ Backend not reachable");
  }
}

(window as any).testBackend = testBackend;
