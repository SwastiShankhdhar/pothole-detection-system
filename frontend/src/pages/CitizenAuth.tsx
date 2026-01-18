import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, MapPin, Phone, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

//CAPTCHA GENERATOR 
const generateCaptcha = (): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let captcha = "";
  for (let i = 0; i < 6; i++) {
    captcha += chars[Math.floor(Math.random() * chars.length)];
  }
  return captcha;
};

   //4-DIGIT OTP GENERATOR
  
const generateOtp = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};


   //INDIAN PHONE VALIDATION (+91 + 10 digits)
   
const isValidIndianPhone = (phone: string): boolean => {
  if (phone.length !== 10) return false;

  for (let i = 0; i < phone.length; i++) {
    if (phone[i] < "0" || phone[i] > "9") return false;
  }
  return true;
};

const CitizenAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isOtpSent, setIsOtpSent] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    otp: "",
    captcha: "",
  });

  
     //CAPTCHA STATE
     
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaTimer, setCaptchaTimer] = useState(60);

  
     //OTP STATE
     
  const [generatedOtp, setGeneratedOtp] = useState("");

 
     //CAPTCHA AUTO REFRESH (60s)
     
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

  
     //SEND OTP
     
  const handleSendOtp = () => {
    if (!isValidIndianPhone(formData.phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Enter a valid 10-digit Indian mobile number.",
        variant: "destructive",
      });
      return;
    }

    const otp = generateOtp();
    setGeneratedOtp(otp);
    setIsOtpSent(true);

    setCaptcha(generateCaptcha());
    setCaptchaTimer(60);

    // Simulation only (backend should send OTP)
    console.log("Generated OTP:", otp);

    toast({
      title: "OTP Sent",
      description: "A 4-digit OTP has been sent to your mobile number.",
    });
  };

      //LOGIN / SIGNUP SUBMIT
     
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.captcha !== captcha) {
      toast({
        title: "Invalid CAPTCHA",
        description: "CAPTCHA does not match.",
        variant: "destructive",
      });
      setCaptcha(generateCaptcha());
      setCaptchaTimer(60);
      return;
    }

    if (formData.otp !== generatedOtp) {
      toast({
        title: "Invalid OTP",
        description: "Incorrect 4-digit OTP.",
        variant: "destructive",
      });
      setCaptcha(generateCaptcha());
      setCaptchaTimer(60);
      return;
    }

    toast({
      title: "Success",
      description: "Authentication successful! Redirecting...",
    });

    setTimeout(() => navigate("/citizen/dashboard"), 1000);
  };

  return (
    <div className="min-h-screen gradient-hero">
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between">
          <Link to="/" className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">PDS</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Link to="/select-account" className="flex items-center gap-2 mb-8 text-muted-foreground">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>

          <Card>
            <CardHeader className="text-center">
              <Phone className="mx-auto w-8 h-8 mb-2 text-primary" />
              <CardTitle>Citizen Portal</CardTitle>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="login">
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                {/* LOGIN */}
                <TabsContent value="login">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Label>Phone Number</Label>
                    <div className="flex gap-2">
                      <Input value="+91" disabled className="w-16 text-center" />
                      <Input
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>

                    {!isOtpSent ? (
                      <Button type="button" onClick={handleSendOtp} className="w-full">
                        Send OTP
                      </Button>
                    ) : (
                      <>
                        <Input
                          placeholder="Enter 4-digit OTP"
                          maxLength={4}
                          value={formData.otp}
                          onChange={(e) =>
                            setFormData({ ...formData, otp: e.target.value })
                          }
                        />

                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-muted p-3 text-center font-mono tracking-widest">
                            {captcha}
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setCaptcha(generateCaptcha());
                              setCaptchaTimer(60);
                            }}
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        </div>

                        <p className="text-xs text-muted-foreground">
                          CAPTCHA expires in {captchaTimer}s
                        </p>

                        <Input
                          placeholder="Enter CAPTCHA"
                          value={formData.captcha}
                          onChange={(e) =>
                            setFormData({ ...formData, captcha: e.target.value })
                          }
                        />

                        <Button type="submit" className="w-full">
                          Verify & Login
                        </Button>
                      </>
                    )}
                  </form>
                </TabsContent>

                {/* SIGNUP */}
                <TabsContent value="signup">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />

                    <Label>Phone Number</Label>
                    <div className="flex gap-2">
                      <Input value="+91" disabled className="w-16 text-center" />
                      <Input
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>

                    {!isOtpSent ? (
                      <Button type="button" onClick={handleSendOtp} className="w-full">
                        Send OTP
                      </Button>
                    ) : (
                      <>
                        <Input
                          placeholder="Enter 4-digit OTP"
                          maxLength={4}
                          value={formData.otp}
                          onChange={(e) =>
                            setFormData({ ...formData, otp: e.target.value })
                          }
                        />

                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-muted p-3 text-center font-mono tracking-widest">
                            {captcha}
                            </div>
                            <Button
                             type="button"
                             variant="outline"
                             onClick={() => {
                              setCaptcha(generateCaptcha());
                              setCaptchaTimer(60);
                             }}
                             >
                              <RefreshCw className="w-4 h-4" />
                              </Button>
                        </div>

                        <Input
                          placeholder="Enter CAPTCHA"
                          value={formData.captcha}
                          onChange={(e) =>
                            setFormData({ ...formData, captcha: e.target.value })
                          }
                        />

                        <Button type="submit" className="w-full">
                          Verify & Sign Up
                        </Button>
                      </>
                    )}
                  </form>
                </TabsContent>
              </Tabs>

              <p className="text-xs text-center text-muted-foreground mt-6">
                Only Indian mobile numbers (+91) are supported.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CitizenAuth;