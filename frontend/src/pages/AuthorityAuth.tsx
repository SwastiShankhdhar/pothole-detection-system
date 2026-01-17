import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, MapPin, Building2, RefreshCw, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authorityApi } from "@/lib/api";

/* ======================================================
   APPROVED AUTHORITY EMAIL DOMAINS
   ====================================================== */
const ALLOWED_AUTHORITY_DOMAINS = [
  "banasthali.in",
  "gov.in",
  "pwd.gov.in",
  "transport.gov.in",
  "roads.gov.in",
  "nagarnigam.in",
  "municipal.in",
];

/* ======================================================
   EMAIL DOMAIN VALIDATION
   ====================================================== */
const isValidAuthorityEmail = (email: string): boolean => {
  if (!email.includes("@")) return false;

  const parts = email.toLowerCase().split("@");
  if (parts.length !== 2) return false;

  const domain = parts[1];

  for (let i = 0; i < ALLOWED_AUTHORITY_DOMAINS.length; i++) {
    if (domain === ALLOWED_AUTHORITY_DOMAINS[i]) {
      return true;
    }
  }
  return false;
};

/* ======================================================
   CAPTCHA GENERATOR
   ====================================================== */
const generateCaptcha = (): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let captcha = "";
  for (let i = 0; i < 6; i++) {
    captcha += chars[Math.floor(Math.random() * chars.length)];
  }
  return captcha;
};

const AuthorityAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  /* =====================
     SIGNUP STATE
     ===================== */
  const [signupData, setSignupData] = useState({
    email: "",
    full_name: "",
    designation: "",
    department: "",
    password: "",
    confirmPassword: "",
  });

  /* =====================
     LOGIN STATE
     ===================== */
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  /* =====================
     CAPTCHA STATE (For future use if needed)
     ===================== */
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaTimer, setCaptchaTimer] = useState(60);

  /* ======================================================
     CAPTCHA AUTO REFRESH (60s)
     ====================================================== */
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      setCaptcha(generateCaptcha());
      setCaptchaTimer(60);
    }, 60000);

    const countdown = setInterval(() => {
      setCaptchaTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(refreshInterval);
      clearInterval(countdown);
    };
  }, []);

  /* ======================================================
     LOGIN SUBMIT
     ====================================================== */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement actual authority login endpoint
      // For now, simulate login
      toast({
        title: "Login Successful",
        description: "Redirecting to dashboard...",
      });
      
      localStorage.setItem("authority", JSON.stringify({
        email: loginData.email,
        loggedIn: true,
      }));
      
      setTimeout(() => navigate("/authority/dashboard"), 1000);
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* ======================================================
     SIGNUP SUBMIT
     ====================================================== */
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidAuthorityEmail(signupData.email)) {
      toast({
        title: "Invalid Authority Email",
        description: "Use your official authority email only.",
        variant: "destructive",
      });
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (signupData.password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Call backend API to sign up
      const response = await authorityApi.signup({
        email: signupData.email,
        full_name: signupData.full_name,
        designation: signupData.designation,
        department: signupData.department,
        password: signupData.password,
      });

      toast({
        title: "Registration Submitted",
        description: response.message || "Please check your email for verification link.",
      });

      console.log("Authority signup response:", response);

    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
      console.error("Authority signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero">
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between">
          <Link to="/" className="flex items-center gap-2">
            <MapPin className="w-6 h-6" />
            <span className="text-xl font-bold">PDS</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Link to="/select-account" className="flex gap-2 mb-6 text-muted-foreground">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>

          <Card>
            <CardHeader className="text-center">
              <Building2 className="mx-auto w-8 h-8 mb-2" />
              <CardTitle>Authority Portal</CardTitle>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="login">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                {/* LOGIN */}
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label>Authority Email ID</Label>
                      <Input
                        type="email"
                        placeholder="official@authority.gov.in"
                        value={loginData.email}
                        onChange={(e) =>
                          setLoginData({ ...loginData, email: e.target.value })
                        }
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div>
                      <Label>Password</Label>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) =>
                          setLoginData({ ...loginData, password: e.target.value })
                        }
                        disabled={isLoading}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </form>
                </TabsContent>

                {/* SIGNUP */}
                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                      <Label>Authority Email ID</Label>
                      <Input
                        type="email"
                        placeholder="official@authority.gov.in"
                        value={signupData.email}
                        onChange={(e) =>
                          setSignupData({ ...signupData, email: e.target.value })
                        }
                        disabled={isLoading}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Only official authority emails allowed
                      </p>
                    </div>
                    
                    <Input 
                      placeholder="Full Name"
                      value={signupData.full_name}
                      onChange={(e) =>
                        setSignupData({ ...signupData, full_name: e.target.value })
                      }
                      disabled={isLoading}
                    />
                    
                    <Input 
                      placeholder="Designation"
                      value={signupData.designation}
                      onChange={(e) =>
                        setSignupData({ ...signupData, designation: e.target.value })
                      }
                      disabled={isLoading}
                    />
                    
                    <div>
                      <Label>Department</Label>
                      <Select
                        value={signupData.department}
                        onValueChange={(value) =>
                          setSignupData({ ...signupData, department: value })
                        }
                        disabled={isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pwd">PWD</SelectItem>
                          <SelectItem value="municipal">Municipal</SelectItem>
                          <SelectItem value="transport">Transport</SelectItem>
                          <SelectItem value="urban">Urban Development</SelectItem>
                          <SelectItem value="rural">Rural Development</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Input 
                      type="password" 
                      placeholder="Create Password (min 6 characters)"
                      value={signupData.password}
                      onChange={(e) =>
                        setSignupData({ ...signupData, password: e.target.value })
                      }
                      disabled={isLoading}
                    />
                    
                    <Input 
                      type="password" 
                      placeholder="Confirm Password"
                      value={signupData.confirmPassword}
                      onChange={(e) =>
                        setSignupData({ ...signupData, confirmPassword: e.target.value })
                      }
                      disabled={isLoading}
                    />

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isLoading || !isValidAuthorityEmail(signupData.email)}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Registration"
                      )}
                    </Button>
                    
                    <p className="text-xs text-center text-muted-foreground">
                      You will receive a verification link via email
                    </p>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AuthorityAuth;