import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertCreatorSchema, type InsertCreator } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FormTooltip } from "@/components/form-tooltip";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

const NICHES = [
  "Tech",
  "Beauty",
  "Gaming",
  "Lifestyle",
  "Education",
  "Food",
  "Travel",
  "Fashion",
  "Fitness",
  "Other"
];

export default function CreatorForm() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<InsertCreator>({
    resolver: zodResolver(insertCreatorSchema),
    defaultValues: {
      name: "",
      niche: "",
      location: "",
      email: "",
      subscribers: 0,
      avgViews: 0,
      engagementRate: "",
      topVideos: [],
      demographics: {
        ageGroups: [],
        genderSplit: "",
        topLocations: []
      },
      contentFormat: "",
      brandAlignment: "",
      postingFrequency: "",
      verificationBadge: "",
      pastCollaborations: "",
      portfolio: "",
      creatorUsp: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertCreator) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "topVideos" || key === "demographics") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      });

      const res = await fetch("/api/creators", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to create profile");
      }

      return res.json();
    },
    onSuccess: (creator) => {
      toast({
        title: "Profile Created",
        description: "Your creator profile has been successfully created.",
      });
      setLocation(`/creator-profile/${creator.id}`);
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
          <CardTitle>Create Your Creator Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Channel Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="niche"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Niche</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your content niche" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {NICHES.map((niche) => (
                            <SelectItem key={niche} value={niche.toLowerCase()}>
                              {niche}
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
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="City, Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Channel Performance */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Channel Performance</h3>
                <FormField
                  control={form.control}
                  name="subscribers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Subscribers
                        <FormTooltip content="Found directly in YouTube Studio" />
                      </FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="avgViews"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Average Views/Video
                        <FormTooltip content="Calculate by dividing total views by number of videos in the last 30 days" />
                      </FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="engagementRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Engagement Rate
                        <FormTooltip content="Calculate as (likes + comments) ÷ views" />
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 5.2%" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Demographics */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Audience Demographics</h3>
                <FormField
                  control={form.control}
                  name="demographics"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Demographics Information</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Age groups, gender split, and top locations"
                          {...field}
                          onChange={(e) => {
                            try {
                              const value = JSON.parse(e.target.value);
                              field.onChange(value);
                            } catch {
                              field.onChange(e.target.value);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Content Style */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Content Style</h3>
                <FormField
                  control={form.control}
                  name="contentFormat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Format</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. tutorials, reviews, vlogs" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brandAlignment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand Alignment</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. eco-friendly startups, gaming hardware" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postingFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Posting Frequency</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 2 videos/week" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Optional Fields */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Additional Information</h3>
                <FormField
                  control={form.control}
                  name="pastCollaborations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Past Collaborations</FormLabel>
                      <FormControl>
                        <Textarea placeholder="List your previous brand collaborations" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="portfolio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Portfolio</FormLabel>
                      <FormControl>
                        <Input placeholder="Link to your media kit or portfolio" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="creatorUsp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Unique Value Proposition</FormLabel>
                      <FormControl>
                        <Textarea placeholder="What makes your channel special?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Verification */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Verification</h3>
                <FormField
                  control={form.control}
                  name="verificationBadge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Verification Badge
                        <FormTooltip content="Upload a screenshot from YouTube Studio analytics" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                field.onChange(reader.result as string);
                              };
                              reader.readAsDataURL(file);
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