import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Shield, Users, BarChart3, ArrowRight, Mail, Phone } from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: MapPin,
      title: "Real-time Detection",
      description: "AI-powered pothole detection using road imagery for accurate mapping.",
    },
    {
      icon: Shield,
      title: "Safety First",
      description: "Color-coded severity levels help citizens identify safe routes.",
    },
    {
      icon: Users,
      title: "Citizen Engagement",
      description: "Easy access for citizens to view road conditions in their area.",
    },
    {
      icon: BarChart3,
      title: "Authority Dashboard",
      description: "Comprehensive analytics for government officials to prioritize repairs.",
    },
  ];

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <MapPin className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">PDS</span>
          </div>
          <Link to="/select-account">
            <Button>Login / Sign Up</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Pothole Detection System
          </h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            An AI-powered solution to detect potholes, inform citizens about road conditions, 
            and help government authorities monitor and improve road infrastructure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/select-account">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Severity Legend */}
      <section className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">Road Condition Indicators</h3>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full severity-safe" />
                <span className="text-sm text-muted-foreground">Safe Roads</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full severity-moderate" />
                <span className="text-sm text-muted-foreground">Moderate Potholes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full severity-danger" />
                <span className="text-sm text-muted-foreground">High Danger</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="card-hover"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-bold">Pothole Detection System</span>
              </div>
              <p className="text-sm text-muted-foreground">
                A third-year engineering project aimed at improving road safety through technology.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/select-account" className="hover:text-primary transition-colors">Login / Sign Up</Link></li>
                <li><a href="#" className="hover:text-primary transition-colors">About Project</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>project@college.edu</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+91 98765 43210</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 Pothole Detection System. Engineering Project.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
