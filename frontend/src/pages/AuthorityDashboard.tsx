import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, LogOut, FileText, TrendingUp, AlertTriangle, CheckCircle, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AuthorityDashboard = () => {
  const { toast } = useToast();
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [updateRequest, setUpdateRequest] = useState({
    region: "",
    description: "",
    status: "",
  });

  // Sample statistics
  const stats = [
    { label: "Total Potholes", value: 156, icon: AlertTriangle, color: "text-severity-danger" },
    { label: "Repaired", value: 89, icon: CheckCircle, color: "text-severity-safe" },
    { label: "In Progress", value: 34, icon: TrendingUp, color: "text-severity-moderate" },
    { label: "Pending", value: 33, icon: FileText, color: "text-primary" },
  ];

  // Sample region data
  const regionData = [
    { name: "Sector 1", safe: 12, moderate: 5, danger: 2 },
    { name: "Sector 2", safe: 8, moderate: 7, danger: 4 },
    { name: "Sector 3", safe: 15, moderate: 3, danger: 1 },
    { name: "Sector 4", safe: 6, moderate: 8, danger: 5 },
  ];

  const handleSubmitUpdate = () => {
    toast({
      title: "Update Request Submitted",
      description: "Your update request has been submitted for verification.",
    });
    setIsUpdateDialogOpen(false);
    setUpdateRequest({ region: "", description: "", status: "" });
  };

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
            <span className="text-sm text-muted-foreground hidden sm:block">Authority Portal</span>
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4 animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold mb-2">Authority Dashboard</h1>
            <p className="text-muted-foreground">Monitor and manage road infrastructure</p>
          </div>
          <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <FileText className="w-4 h-4" />
                Report / Update Request
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit Update Request</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="region">Region / Area</Label>
                  <Select onValueChange={(value) => setUpdateRequest({ ...updateRequest, region: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sector1">Sector 1</SelectItem>
                      <SelectItem value="sector2">Sector 2</SelectItem>
                      <SelectItem value="sector3">Sector 3</SelectItem>
                      <SelectItem value="sector4">Sector 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Update Status</Label>
                  <Select onValueChange={(value) => setUpdateRequest({ ...updateRequest, status: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="repair_complete">Repair Completed</SelectItem>
                      <SelectItem value="repair_progress">Repair In Progress</SelectItem>
                      <SelectItem value="scheduled">Repair Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide details about the road repair or maintenance work..."
                    value={updateRequest.description}
                    onChange={(e) => setUpdateRequest({ ...updateRequest, description: e.target.value })}
                    rows={4}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Note: The system will verify the update by re-analyzing recent road images.
                </p>
                <Button onClick={handleSubmitUpdate} className="w-full">
                  Submit Update Request
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Region-wise Pothole Map</CardTitle>
                <div className="relative w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search region..." className="pl-10 h-9" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                  {/* Placeholder Map Design */}
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted">
                    {/* Grid lines */}
                    <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
                      {[...Array(16)].map((_, i) => (
                        <div key={i} className="border border-muted-foreground/10" />
                      ))}
                    </div>
                    
                    {/* Region labels */}
                    <div className="absolute top-[15%] left-[20%] text-xs font-medium text-muted-foreground bg-card/80 px-2 py-1 rounded">Sector 1</div>
                    <div className="absolute top-[15%] left-[60%] text-xs font-medium text-muted-foreground bg-card/80 px-2 py-1 rounded">Sector 2</div>
                    <div className="absolute top-[55%] left-[20%] text-xs font-medium text-muted-foreground bg-card/80 px-2 py-1 rounded">Sector 3</div>
                    <div className="absolute top-[55%] left-[60%] text-xs font-medium text-muted-foreground bg-card/80 px-2 py-1 rounded">Sector 4</div>
                    
                    {/* Pothole clusters */}
                    <div className="absolute top-[25%] left-[25%] w-6 h-6 rounded-full severity-safe opacity-80" />
                    <div className="absolute top-[30%] left-[35%] w-5 h-5 rounded-full severity-moderate opacity-80" />
                    <div className="absolute top-[25%] left-[65%] w-7 h-7 rounded-full severity-danger opacity-80" />
                    <div className="absolute top-[35%] left-[75%] w-5 h-5 rounded-full severity-moderate opacity-80" />
                    <div className="absolute top-[65%] left-[25%] w-5 h-5 rounded-full severity-safe opacity-80" />
                    <div className="absolute top-[70%] left-[70%] w-6 h-6 rounded-full severity-moderate opacity-80" />
                  </div>
                  
                  <div className="relative z-10 text-center p-4 bg-card/90 rounded-lg shadow-lg">
                    <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Interactive region map<br />
                      Click on regions for detailed data
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Region Data */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Region Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regionData.map((region) => (
                  <div key={region.name} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="font-medium mb-2">{region.name}</div>
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full severity-safe" />
                        <span className="text-muted-foreground">{region.safe}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full severity-moderate" />
                        <span className="text-muted-foreground">{region.moderate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full severity-danger" />
                        <span className="text-muted-foreground">{region.danger}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Legend */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-6 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full severity-safe" />
                <span className="text-sm text-muted-foreground">Safe Roads</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full severity-moderate" />
                <span className="text-sm text-muted-foreground">Moderate Potholes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full severity-danger" />
                <span className="text-sm text-muted-foreground">High Risk Areas</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AuthorityDashboard;