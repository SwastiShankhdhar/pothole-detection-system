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
import { fetchApi } from "@/lib/fetch-api.ts";
// import * as authorityApi from "@/lib/api";

// import * as authorityApi from "@/lib/api";


const ALLOWED_AUTHORITY_DOMAINS = [
  "banasthali.in",
  "gov.in",
  "pwd.gov.in",
  "transport.gov.in",
  "roads.gov.in",
  "nagarnigam.in",
  "municipal.in",
];

const isValidAuthorityEmail = (email: string): boolean => {
  if (!email.includes("@")) return false;
  const domain = email.toLowerCase().split("@")[1];
  return ALLOWED_AUTHORITY_DOMAINS.includes(domain);
};

const generateCaptcha = (): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

const AuthorityAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [signupData, setSignupData] = useState({
    authorityEmail: "",
    name: "",
    designation: "",
    department: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    otp: "",
    captcha: "",
  });

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaTimer, setCaptchaTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const refresh = setInterval(() => {
      setCaptcha(generateCaptcha());
      setCaptchaTimer(60);
    }, 60000);

    const countdown = setInterval(() => {
      setCaptchaTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(refresh);
      clearInterval(countdown);
    };
  }, []);

  const handleSendOtp = async () => {
    if (!isValidAuthorityEmail(loginData.email)) {
      toast({ title: "Invalid Email", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      await fetchApi.authority.sendOTP(loginData.email, captcha);
      setIsOtpSent(true);
      setCaptcha(generateCaptcha());
      setCaptchaTimer(60);
      toast({ title: "OTP Sent" });
    } catch (e: any) {
      toast({ title: "OTP Failed", description: e.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loginData.captcha !== captcha) {
      toast({ title: "Wrong CAPTCHA", variant: "destructive" });
      setCaptcha(generateCaptcha());
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetchApi.authority.verifyOTP(
        loginData.email,
        loginData.otp,
        loginData.captcha
      );

      localStorage.setItem("authority", JSON.stringify(res.authority));
      navigate("/authority/dashboard");
    } catch (e: any) {
      toast({ title: "Login Failed", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      await fetchApi.authority.signup({
        email: signupData.authorityEmail,
        name: signupData.name,
        designation: signupData.designation,
        department: signupData.department,
        password: signupData.password,
      });

      toast({ title: "Registered" });
      navigate("/authority/dashboard");
    } catch (e: any) {
      toast({ title: "Signup Failed", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero">
      <main className="container mx-auto px-4 py-12 max-w-md">
        <Card>
          <CardHeader className="text-center">
            <Building2 className="mx-auto mb-2" />
            <CardTitle>Authority Portal</CardTitle>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <Input
                    placeholder="Authority Email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  />

                  {!isOtpSent ? (
                    <Button onClick={handleSendOtp} disabled={isLoading} className="w-full">
                      {isLoading ? <Loader2 className="animate-spin" /> : "Send OTP"}
                    </Button>
                  ) : (
                    <>
                      <Input
                        placeholder="OTP"
                        value={loginData.otp}
                        onChange={(e) => setLoginData({ ...loginData, otp: e.target.value })}
                      />

                      <div className="flex gap-2">
                        <div className="flex-1 text-center font-mono bg-muted p-2">{captcha}</div>
                        <Button
                          variant="outline"
                          onClick={() => setCaptcha(generateCaptcha())}
                        >
                          <RefreshCw />
                        </Button>
                      </div>

                      <Input
                        placeholder="Enter CAPTCHA"
                        value={loginData.captcha}
                        onChange={(e) =>
                          setLoginData({ ...loginData, captcha: e.target.value })
                        }
                      />

                      <Button type="submit" disabled={isLoading} className="w-full">
                        Verify & Login
                      </Button>
                    </>
                  )}
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-3">
                  <Input placeholder="Email" onChange={(e) => setSignupData({ ...signupData, authorityEmail: e.target.value })} />
                  <Input placeholder="Name" onChange={(e) => setSignupData({ ...signupData, name: e.target.value })} />
                  <Input placeholder="Designation" onChange={(e) => setSignupData({ ...signupData, designation: e.target.value })} />
                  <Input placeholder="Department" onChange={(e) => setSignupData({ ...signupData, department: e.target.value })} />
                  <Input type="password" placeholder="Password" onChange={(e) => setSignupData({ ...signupData, password: e.target.value })} />
                  <Button className="w-full">Register</Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AuthorityAuth;
