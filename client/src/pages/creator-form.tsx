import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertCreatorSchema, type InsertCreator } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FormTooltip } from "@/components/form-tooltip";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

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
      demographics: {},
      contentFormat: "",
      brandAlignment: "",
      postingFrequency: "",
      verificationBadge: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertCreator) => {
      const res = await apiRequest("POST", "/api/creators", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Created",
        description: "Your creator profile has been successfully created.",
      });
      setLocation("/");
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
                name="subscribers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Subscribers
                      <FormTooltip content="Found directly in YouTube Studio" />
                    </FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
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
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Add remaining form fields following the same pattern */}
              
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
