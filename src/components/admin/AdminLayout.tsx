import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Bell,
  FileText,
  Users,
  LogOut,
  Menu,
  X,
  Building2,
  GraduationCap,
  Image as ImageIcon,
  Clock,
  Calendar,
  BookOpen,
  WifiOff,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useAdminProtect } from "@/hooks/useAdminProtect";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingOverlay } from "./LoadingOverlay";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const sidebarItems = [
  { icon: LayoutDashboard, label: "ড্যাশবোর্ড", path: "/admin/dashboard" },
  { icon: Users, label: "অ্যাডমিন/শিক্ষক তালিকা", path: "/admin/users" },
  { icon: Calendar, label: "পরীক্ষার রুটিন", path: "/admin/routine" },
  { icon: BookOpen, label: "ক্লাস রুটিন", path: "/admin/class-routine" },
  { icon: Clock, label: "টিচার্স রেজিস্ট্রেশন", path: "/admin/approvals" },
  { icon: Bell, label: "নোটিশ ব্যবস্থাপনা", path: "/admin/notices" },
  { icon: FileText, label: "ফলাফল ব্যবস্থাপনা", path: "/admin/results" },
  { icon: Users, label: "ভর্তি আবেদন", path: "/admin/admissions" },
  { icon: Building2, label: "শাখা ব্যবস্থাপনা", path: "/admin/branches" },
  { icon: GraduationCap, label: "শিক্ষক ব্যবস্থাপনা", path: "/admin/teachers" }, // Added Teacher Management link
  { icon: ImageIcon, label: "গ্যালারি ব্যবস্থাপনা", path: "/admin/gallery" },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, isLoading, logout, connectionError, refreshSession } = useAuth();
  const { toast } = useToast();

  // Protect admin routes - checks if user is admin
  useAdminProtect();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "লগআউট সফল",
        description: "আপনি সফলভাবে লগআউট করেছেন",
      });
    } catch (err) {
      toast({
        title: "ত্রুটি",
        description: "লগআউটে সমস্যা হয়েছে",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex bg-muted/30">
        <aside className="w-64 bg-card border-r hidden lg:block">
          <div className="p-4 space-y-6">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-30 bg-background border-b px-4 py-3">
            <Skeleton className="h-8 w-48" />
          </header>
          <main className="flex-1 p-4 md:p-6">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-64 w-full rounded-lg" />
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-lg" />
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-muted/30 relative">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 lg:translate-x-0 lg:static",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-4 border-b">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="বুলবুল ললিতকলা" className="h-12 w-auto" />
              <div>
                <h2 className="font-bold text-sm">বুলবুল ললিতকলা</h2>
                <p className="text-xs text-muted-foreground">অ্যাডমিন প্যানেল</p>
              </div>
            </Link>
          </div>

          {/* User Info */}
          <div className="p-4 border-b bg-muted/50">
            <p className="text-xs text-muted-foreground mb-1">লগইনকৃত ব্যবহারকারী</p>
            <p className="text-sm font-medium truncate">{user?.email || "Unknown"}</p>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 p-4 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              লগআউট
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-background border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>
          <div className="text-sm text-muted-foreground">স্বাগতম, এডমিন</div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6">
          {connectionError && (
            <Alert variant="destructive" className="mb-6 bg-red-50 border-red-200 text-red-800">
              <WifiOff className="h-4 w-4 text-red-600" />
              <AlertTitle className="font-bold">কানেকশন সমস্যা</AlertTitle>
              <AlertDescription className="flex items-center justify-between">
                <span>{connectionError}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-4 h-8 bg-white border-red-300 hover:bg-red-50 text-red-700"
                  onClick={() => refreshSession()}
                >
                  <RefreshCw className="mr-2 h-3 w-3" />
                  পুনরায় চেষ্টা করুন
                </Button>
              </AlertDescription>
            </Alert>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}