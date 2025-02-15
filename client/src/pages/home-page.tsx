import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Youtube, Briefcase, Link as LinkIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Creator, Brand } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: creators, isLoading: isLoadingCreators } = useQuery<Creator[]>({
    queryKey: ["/api/creators"],
  });

  const { data: brands, isLoading: isLoadingBrands } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
  });

  const copyProfileLink = (path: string) => {
    const url = `${window.location.origin}${path}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied",
      description: "Profile link has been copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">
          Connect Creators with Brands
        </h1>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
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

        {/* Creators List */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Creator Profiles</h2>
          {isLoadingCreators ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : creators?.length ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {creators.map((creator) => (
                <Card key={creator.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{creator.name}</h3>
                        <p className="text-sm text-muted-foreground">{creator.niche}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyProfileLink(`/creator-profile/${creator.id}`)}
                      >
                        <LinkIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm">{creator.location}</p>
                    <Button
                      variant="link"
                      className="px-0"
                      onClick={() => setLocation(`/creator-profile/${creator.id}`)}
                    >
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No creator profiles yet</p>
          )}
        </div>

        {/* Brands List */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Brand Profiles</h2>
          {isLoadingBrands ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : brands?.length ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {brands.map((brand) => (
                <Card key={brand.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{brand.industry}</h3>
                        <p className="text-sm text-muted-foreground">{brand.campaignType}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyProfileLink(`/brand-profile/${brand.id}`)}
                      >
                        <LinkIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="link"
                      className="px-0"
                      onClick={() => setLocation(`/brand-profile/${brand.id}`)}
                    >
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No brand profiles yet</p>
          )}
        </div>
      </div>
    </div>
  );
}