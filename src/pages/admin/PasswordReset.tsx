import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Loader2, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/client";
import { z } from "zod";

// Two states: 1) Request reset email, 2) Set new password
type PageState = "request" | "reset";

const requestSchema = z.object({
  email: z.string().email("সঠিক ইমেইল দিন"),
});

const resetSchema = z.object({
  password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "পাসওয়ার্ড মিলছে না",
  path: ["confirmPassword"],
});

export default function PasswordReset() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // Check if user came from email link
  const tokenType = searchParams.get("type");
  const token = searchParams.get("token");
  const hasResetToken = tokenType === "recovery" && token;

  const [pageState, setPageState] = useState<PageState>(hasResetToken ? "reset" : "request");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  // Request state
  const [email, setEmail] = useState("");

  // Reset state
  const [resetData, setResetData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = requestSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.errors[0]?.message || "ইমেইলে সমস্যা আছে");
      setIsLoading(false);
      return;
    }

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/password-reset`,
      });

      if (resetError) {
        setError(resetError.message);
        setIsLoading(false);
        return;
      }

      setEmailSent(true);
      toast({
        title: "সফল!",
        description: "পাসওয়ার্ড রিসেট লিঙ্ক ইমেইলে পাঠানো হয়েছে।",
      });
    } catch (error: unknown) {
      setError("একটি ত্রুটি ঘটেছে। পুনরায় চেষ্টা করুন।");
      console.error("Reset request error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = resetSchema.safeParse(resetData);
    if (!result.success) {
      setError(result.error.errors[0]?.message || "পাসওয়ার্ডে সমস্যা আছে");
      setIsLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: resetData.password,
      });

      if (updateError) {
        setError(updateError.message);
        setIsLoading(false);
        return;
      }

      toast({
        title: "সফল!",
        description: "আপনার পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে।",
      });

      // Redirect to login
      setTimeout(() => {
        navigate("/admin/login");
      }, 2000);
    } catch (error: unknown) {
      setError("পাসওয়ার্ড পরিবর্তনে সমস্যা হয়েছে।");
      console.error("Password reset error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Request state - email sent
  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pattern-cultural py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">ইমেইল পাঠানো হয়েছে!</CardTitle>
            <CardDescription>
              আপনার ইনবক্স চেক করুন
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              পাসওয়ার্ড রিসেট লিঙ্ক সহ একটি ইমেইল আপনাকে পাঠানো হয়েছে।
              লিঙ্কে ক্লিক করুন এবং নতুন পাসওয়ার্ড সেট করুন।
            </p>
            <p className="text-xs text-muted-foreground">
              (ইমেইল কয়েক মিনিট নিতে পারে)
            </p>
            <Button className="w-full" onClick={() => navigate("/admin/login")}>
              লগইন পৃষ্ঠায় যান
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Request state - form
  if (pageState === "request") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pattern-cultural py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
                <Lock className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl">পাসওয়ার্ড ভুলে গেছেন?</CardTitle>
            <CardDescription>
              আপনার ইমেইল দিন, আমরা লিঙ্ক পাঠাব
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRequestSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">ইমেইল</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@school.edu.bd"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    পাঠাচ্ছি...
                  </>
                ) : (
                  "রিসেট লিঙ্ক পাঠান"
                )}
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">নতুন করে চেষ্টা করবেন? </span>
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

  // Reset state - new password form
  return (
    <div className="min-h-screen flex items-center justify-center bg-pattern-cultural py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
              <Lock className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">নতুন পাসওয়ার্ড সেট করুন</CardTitle>
          <CardDescription>
            একটি শক্তিশালী পাসওয়ার্ড তৈরি করুন
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">নতুন পাসওয়ার্ড</Label>
              <Input
                id="password"
                type="password"
                placeholder="কমপক্ষে ৬ অক্ষর"
                value={resetData.password}
                onChange={(e) => setResetData({ ...resetData, password: e.target.value })}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">পাসওয়ার্ড নিশ্চিত করুন</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="পাসওয়ার্ড আবার প্রবেশ করুন"
                value={resetData.confirmPassword}
                onChange={(e) => setResetData({ ...resetData, confirmPassword: e.target.value })}
                disabled={isLoading}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  আপডেট করছি...
                </>
              ) : (
                "পাসওয়ার্ড আপডেট করুন"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
