import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertBrandSchema, type InsertBrand } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

const CAMPAIGN_TYPES = [
  "Product Review",
  "Sponsored Content",
  "Brand Integration",
  "Tutorial/How-To",
  "Unboxing",
  "Brand Ambassador",
  "Other"
];

export default function BrandForm() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<InsertBrand>({
    resolver: zodResolver(insertBrandSchema),
    defaultValues: {
      industry: "",
      campaignType: "",
      targetAudience: "",
      deliverables: {
        videoRequirements: {
          count: 0,
          duration: "",
          style: "",
        },
        socialMedia: {
          platforms: [],
          requirements: "",
        },
        additionalRequirements: "",
      },
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertBrand) => {
      const res = await apiRequest("POST", "/api/brands", data);
      return await res.json();
    },
    onSuccess: (brand) => {
      toast({
        title: "Profile Created",
        description: "Your brand profile has been successfully created.",
      });
      setLocation(`/brand-profile/${brand.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create Your Brand Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Eco-Friendly Tech" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="campaignType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select campaign type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CAMPAIGN_TYPES.map((type) => (
                            <SelectItem key={type} value={type.toLowerCase()}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 18-34 (50% male, 50% female)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Deliverables */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Campaign Deliverables</h3>
                <FormField
                  control={form.control}
                  name="deliverables"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deliverables Requirements</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={`Specify your campaign requirements in detail:
- Number and duration of videos
- Type of content (review, tutorial, etc.)
- Additional social media posts
- Any specific hashtags or mentions
- Key messages to include`}
                          className="min-h-[200px]"
                          {...field}
                          onChange={(e) => {
                            try {
                              const value = JSON.parse(e.target.value);
                              field.onChange(value);
                            } catch {
                              field.onChange({
                                ...field.value,
                                additionalRequirements: e.target.value,
                              });
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={mutation.isPending}>
                {mutation.isPending ? "Creating..." : "Create Profile"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}