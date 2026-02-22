import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Lock, User, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { loginAsAdmin } from "@/integrations/auth";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const validateForm = (): boolean => {
    if (!credentials.email.trim()) {
      setError("ইমেইল দিন");
      return false;
    }

    if (!credentials.email.includes("@")) {
      setError("সঠিক ইমেইল দিন");
      return false;
    }

    if (!credentials.password) {
      setError("পাসওয়ার্ড দিন");
      return false;
    }

    if (credentials.password.length < 6) {
      setError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log("AdminLogin: Attempting login with email:", credentials.email);
      const result = await loginAsAdmin(credentials.email, credentials.password);
      console.log("AdminLogin: Login result:", result);

      if (!result.success) {
        setError(result.error || "লগইন ব্যর্থ হয়েছে");
        setIsLoading(false);
        return;
      }

      toast({
        title: "লগইন সফল!",
        description: "অ্যাডমিন ড্যাশবোর্ডে স্বাগতম।",
      });

      console.log("AdminLogin: Navigating to /admin/dashboard...");
      navigate("/admin/dashboard");
    } catch (err) {
      setError("লগইন প্রক্রিয়ায় সমস্যা হয়েছে");
      console.error("AdminLogin: Unexpected error during login:", err);
    } finally {
      setIsLoading(false);
      console.log("AdminLogin: Finished handleSubmit.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pattern-cultural py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">অ্যাডমিন লগইন</CardTitle>
          <CardDescription>
            বুলবুল ললিতকলা একাডেমী প্রশাসনিক প্যানেল
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
              <Label htmlFor="email">ইমেইল</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  className="pl-10"
                  value={credentials.email}
                  onChange={(e) => {
                    setCredentials({ ...credentials, email: e.target.value });
                    setError("");
                  }}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">পাসওয়ার্ড</Label>
                <a
                  href="/admin/password-reset"
                  className="text-xs text-primary hover:underline"
                >
                  পাসওয়ার্ড ভুলে গেছেন?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={credentials.password}
                  onChange={(e) => {
                    setCredentials({ ...credentials, password: e.target.value });
                    setError("");
                  }}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  লগইন হচ্ছে...
                </>
              ) : (
                "লগইন করুন"
              )}
            </Button>
          </form>

          <div className="mt-4 p-4 bg-muted rounded-lg space-y-3">
            <p className="text-sm text-muted-foreground text-center">
              শুধুমাত্র এডমিন রোল সম্পন্ন ইউজার লগইন করতে পারবেন।
            </p>
            <Button
              variant="link"
              size="sm"
              className="w-full text-muted-foreground hover:text-primary transition-colors text-xs"
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
            >
              লগইন সমস্যায় ভুগছেন? সেশন রিসেট করুন
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}