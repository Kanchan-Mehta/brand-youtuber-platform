import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Creator } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";

export default function CreatorProfile({ id }: { id: string }) {
  const [, setLocation] = useLocation();

  const { data: creator, isLoading } = useQuery<Creator>({
    queryKey: [`/api/creators/${id}`],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Creator profile not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Creator Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <section>
            <h3 className="text-lg font-medium mb-4">Basic Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Channel Name</p>
                <p className="font-medium">{creator.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Niche</p>
                <p className="font-medium">{creator.niche}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{creator.location}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contact Email</p>
                <p className="font-medium">{creator.email}</p>
              </div>
            </div>
          </section>

          {/* Performance Metrics */}
          <section>
            <h3 className="text-lg font-medium mb-4">Channel Performance</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Subscribers</p>
                <p className="font-medium">{creator.subscribers.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Views</p>
                <p className="font-medium">{creator.avgViews.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Engagement Rate</p>
                <p className="font-medium">{creator.engagementRate}</p>
              </div>
            </div>
          </section>

          {/* Demographics */}
          <section>
            <h3 className="text-lg font-medium mb-4">Audience Demographics</h3>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(creator.demographics, null, 2)}
              </pre>
            </div>
          </section>

          {/* Content Style */}
          <section>
            <h3 className="text-lg font-medium mb-4">Content Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Content Format</p>
                <p className="font-medium">{creator.contentFormat}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Brand Alignment</p>
                <p className="font-medium">{creator.brandAlignment}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Posting Frequency</p>
                <p className="font-medium">{creator.postingFrequency}</p>
              </div>
            </div>
          </section>

          {/* Additional Information */}
          {(creator.pastCollaborations || creator.portfolio || creator.creatorUsp) && (
            <section>
              <h3 className="text-lg font-medium mb-4">Additional Information</h3>
              <div className="space-y-4">
                {creator.pastCollaborations && (
                  <div>
                    <p className="text-sm text-muted-foreground">Past Collaborations</p>
                    <p className="font-medium whitespace-pre-wrap">{creator.pastCollaborations}</p>
                  </div>
                )}
                {creator.portfolio && (
                  <div>
                    <p className="text-sm text-muted-foreground">Portfolio</p>
                    <a href={creator.portfolio} target="_blank" rel="noopener noreferrer" 
                       className="text-primary hover:underline">
                      View Portfolio
                    </a>
                  </div>
                )}
                {creator.creatorUsp && (
                  <div>
                    <p className="text-sm text-muted-foreground">Unique Value Proposition</p>
                    <p className="font-medium whitespace-pre-wrap">{creator.creatorUsp}</p>
                  </div>
                )}
              </div>
            </section>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
