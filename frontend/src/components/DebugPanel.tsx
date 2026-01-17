import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { testConnection } from "@/lib/api";
import { Loader2, Wifi, WifiOff } from "lucide-react";

export const DebugPanel = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{success: boolean; error?: string} | null>(null);

  const testBackend = async () => {
    setTesting(true);
    const res = await testConnection();
    setResult(res);
    setTesting(false);
  };

  return (
    <Card className="fixed bottom-4 right-4 w-64 shadow-lg z-50">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {result ? (
              result.success ? (
                <Wifi className="w-4 h-4 text-green-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-500" />
              )
            ) : (
              <Wifi className="w-4 h-4 text-gray-400" />
            )}
            <span className="text-sm font-medium">Backend Status</span>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={testBackend}
            disabled={testing}
            className="h-7 text-xs"
          >
            {testing ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              "Test"
            )}
          </Button>
        </div>
        
        {result && (
          <div className={`text-xs ${result.success ? 'text-green-600' : 'text-red-600'}`}>
            {result.success ? "✅ Connected to backend" : `❌ ${result.error}`}
          </div>
        )}
        
        <div className="text-xs text-gray-500 mt-2">
          Backend: http://localhost:8000
        </div>
      </CardContent>
    </Card>
  );
};