import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Youtube, Briefcase } from "lucide-react";

export default function HomePage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">
          Connect Creators with Brands
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Youtube className="h-6 w-6 text-red-500" />
                <span>For Creators</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-muted-foreground">
                Showcase your channel metrics and connect with brands looking for authentic partnerships.
              </p>
              <Button
                className="w-full"
                onClick={() => setLocation("/creator-form")}
              >
                Create Creator Profile
              </Button>
            </CardContent>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-blue-500" />
                <span>For Brands</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-muted-foreground">
                Find creators that align with your brand values and campaign goals.
              </p>
              <Button
                className="w-full"
                onClick={() => setLocation("/brand-form")}
              >
                Create Brand Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
