import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, LogOut, Navigation } from "lucide-react";

const CitizenDashboard = () => {
  const [location, setLocation] = useState("");

  // Sample pothole data for display
  const potholeStats = [
    { label: "Safe Roads", count: 45, color: "severity-safe" },
    { label: "Moderate", count: 28, color: "severity-moderate" },
    { label: "High Risk", count: 12, color: "severity-danger" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <MapPin className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">PDS</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">Welcome, Citizen</span>
            <Link to="/">
              <Button variant="outline" size="sm" className="gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl font-bold mb-2">Citizen Dashboard</h1>
          <p className="text-muted-foreground">View road conditions and pothole information in your area</p>
        </div>

        {/* Location Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Enter your location or area name..."
                  className="pl-10"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <Button className="gap-2">
                <Navigation className="w-4 h-4" />
                Use Current Location
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {potholeStats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 text-center">
                <div className={`w-3 h-3 rounded-full ${stat.color} mx-auto mb-2`} />
                <div className="text-2xl font-bold">{stat.count}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Map Placeholder */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Road Condition Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
              {/* Placeholder Map Design */}
              <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted">
                {/* Simulated roads */}
                <div className="absolute top-1/4 left-0 right-0 h-1 bg-muted-foreground/20" />
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted-foreground/20" />
                <div className="absolute top-3/4 left-0 right-0 h-1 bg-muted-foreground/20" />
                <div className="absolute left-1/4 top-0 bottom-0 w-1 bg-muted-foreground/20" />
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-muted-foreground/20" />
                <div className="absolute left-3/4 top-0 bottom-0 w-1 bg-muted-foreground/20" />
                
                {/* Pothole markers */}
                <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full severity-safe shadow-lg" />
                <div className="absolute top-1/4 left-1/2 w-4 h-4 rounded-full severity-moderate shadow-lg" />
                <div className="absolute top-1/2 left-1/4 w-4 h-4 rounded-full severity-danger shadow-lg" />
                <div className="absolute top-1/2 left-3/4 w-4 h-4 rounded-full severity-safe shadow-lg" />
                <div className="absolute top-3/4 left-1/2 w-4 h-4 rounded-full severity-moderate shadow-lg" />
                <div className="absolute top-3/4 left-3/4 w-4 h-4 rounded-full severity-safe shadow-lg" />
              </div>
              
              <div className="relative z-10 text-center p-4 bg-card/90 rounded-lg shadow-lg">
                <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Interactive map will load here<br />
                  Showing pothole data for your selected area
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Map Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full severity-safe" />
                <div>
                  <div className="text-sm font-medium">Safe</div>
                  <div className="text-xs text-muted-foreground">No potholes detected</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full severity-moderate" />
                <div>
                  <div className="text-sm font-medium">Moderate</div>
                  <div className="text-xs text-muted-foreground">Some potholes present</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full severity-danger" />
                <div>
                  <div className="text-sm font-medium">High Risk</div>
                  <div className="text-xs text-muted-foreground">Many potholes, use caution</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CitizenDashboard;
