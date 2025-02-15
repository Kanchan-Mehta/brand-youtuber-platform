import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brand } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function BrandProfile({ id }: { id: string }) {
  const { data: brand, isLoading } = useQuery<Brand>({
    queryKey: [`/api/brands/${id}`],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Brand profile not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Brand Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <section>
            <h3 className="text-lg font-medium mb-4">Company Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Industry</p>
                <p className="font-medium">{brand.industry}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Campaign Type</p>
                <p className="font-medium">{brand.campaignType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Target Audience</p>
                <p className="font-medium">{brand.targetAudience}</p>
              </div>
            </div>
          </section>

          {/* Deliverables */}
          <section>
            <h3 className="text-lg font-medium mb-4">Campaign Deliverables</h3>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(brand.deliverables, null, 2)}
              </pre>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
