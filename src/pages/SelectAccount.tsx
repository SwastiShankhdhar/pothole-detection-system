import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building2, ArrowLeft, MapPin } from "lucide-react";

const SelectAccount = () => {
  const accountTypes = [
    {
      type: "citizen",
      title: "I am a Citizen",
      description: "Access road condition information and view pothole data in your area.",
      icon: Users,
      link: "/citizen/auth",
    },
    {
      type: "authority",
      title: "I am an Authority",
      description: "Monitor road infrastructure, manage updates, and access analytics.",
      icon: Building2,
      link: "/authority/auth",
    },
  ];

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <MapPin className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">PDS</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          {/* Title */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Identify Your Account Type
            </h1>
            <p className="text-muted-foreground">
              Select how you want to use the Pothole Detection System
            </p>
          </div>

          {/* Account Type Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {accountTypes.map((account, index) => (
              <Link key={account.type} to={account.link}>
                <Card 
                  className="h-full card-hover cursor-pointer border-2 border-transparent hover:border-primary/30"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <account.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold mb-3">{account.title}</h2>
                    <p className="text-muted-foreground text-sm mb-6">
                      {account.description}
                    </p>
                    <Button className="w-full">Continue</Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SelectAccount;
