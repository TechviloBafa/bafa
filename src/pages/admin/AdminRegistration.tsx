import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GraduationCap, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/client";
import { z } from "zod";

// Validation schema
const registrationSchema = z.object({
  email: z.string().email("সঠিক ইমেইল দিন"),
  password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে"),
  confirmPassword: z.string(),
  fullName: z.string().min(3, "সম্পূর্ণ নাম প্রয়োজন"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "পাসওয়ার্ড মিলছে না",
  path: ["confirmPassword"],
});

export default function AdminRegistration() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate form
    const result = registrationSchema.safeParse(formData);
    if (!result.success) {
      setError(result.error.errors[0]?.message || "ফর্মে সমস্যা আছে");
      setIsLoading(false);
      return;
    }

    try {
      // 1. Create user in Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (signUpError) {
        setError(signUpError.message);
        setIsLoading(false);
        return;
      }

      if (!authData.user) {
        setError("ব্যবহারকারী তৈরি করতে সমস্যা হয়েছে");
        setIsLoading(false);
        return;
      }

      // 2. Add to pending_admins table with user_id
      const { error: pendingError } = await supabase.from("pending_admins").insert({
        user_id: authData.user.id,
        email: formData.email,
        full_name: formData.fullName,
        status: "pending",
      });

      if (pendingError) {
        setError("নিবন্ধন প্রক্রিয়ায় সমস্যা হয়েছে");
        console.error("Pending admin error:", pendingError);
        setIsLoading(false);
        return;
      }

      // Success
      setSubmitted(true);
      toast({
        title: "নিবন্ধন সফল!",
        description: "আপনার আবেদন জমা হয়েছে। অনুমোদনের জন্য অপেক্ষা করুন।",
      });

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error: unknown) {
      console.error("Registration error:", error);
      setError("নিবন্ধনে একটি ত্রুটি হয়েছে। পুনরায় চেষ্টা করুন।");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pattern-cultural py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">নিবন্ধন সফল!</CardTitle>
            <CardDescription>
              আপনার আবেদন জমা হয়েছে
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              অনুগ্রহ করে অনুমোদনের জন্য অপেক্ষা করুন। প্রশাসক শীঘ্রই আপনার অ্যাকাউন্ট সক্রিয় করবেন।
            </p>
            <Button className="w-full" onClick={() => navigate("/")}>
              হোমে যান
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-pattern-cultural py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">শিক্ষক/প্রশাসক নিবন্ধন</CardTitle>
          <CardDescription>
            বুলবুল ললিতকলা একাডেমী প্রশাসনিক অ্যাক্সেস
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName">সম্পূর্ণ নাম</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="আপনার নাম প্রবেश করুন"
                value={formData.fullName}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">ইমেইল</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@school.edu.bd"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">পাসওয়ার্ড</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="কমপক্ষে ৬ অক্ষর"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">পাসওয়ার্ড নিশ্চিত করুন</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="পাসওয়ার্ড আবার প্রবেশ করুন"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  নিবন্ধন করছি...
                </>
              ) : (
                "নিবন্ধন করুন"
              )}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">ইতিমধ্যে অ্যাকাউন্ট আছে? </span>
              <a
                href="/admin/login"
                className="text-primary hover:underline font-medium"
              >
                লগইন করুন
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
