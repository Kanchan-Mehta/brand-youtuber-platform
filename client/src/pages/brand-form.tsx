import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertBrandSchema, type InsertBrand } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

export default function BrandForm() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const form = useForm<InsertBrand>({
    resolver: zodResolver(insertBrandSchema),
    defaultValues: {
      industry: "",
      campaignType: "",
      targetAudience: "",
      deliverables: {},
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertBrand) => {
      const res = await apiRequest("POST", "/api/brands", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Created",
        description: "Your brand profile has been successfully created.",
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
          <CardTitle>Create Your Brand Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
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
                    <FormControl>
                      <Input placeholder="e.g. Product Review" {...field} />
                    </FormControl>
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

              <FormField
                control={form.control}
                name="deliverables"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deliverables</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Specify campaign requirements (e.g. 1 video, 90 seconds, 2 Instagram stories)"
                        {...field}
                        onChange={(e) => field.onChange(JSON.parse(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
