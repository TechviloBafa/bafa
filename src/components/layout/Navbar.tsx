import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "হোম", path: "/" },
  {
    label: "আমাদের সম্পর্কে",
    children: [
      { label: "অধ্যক্ষের বাণী", path: "/about/principal-message" },
      { label: "পরিচালনা পর্ষদ", path: "/about/governing-body" },
      { label: "শিক্ষক তথ্য", path: "/about/teachers" },
      { label: "কর্মচারী তথ্য", path: "/about/staff" },
    ],
  },
  {
    label: "একাডেমিক",
    children: [
      { label: "একাডেমিক ক্যালেন্ডার", path: "/academic/calendar" },
      { label: "ক্লাস রুটিন", path: "/academic/routine" },
    ],
  },
  {
    label: "পরীক্ষা",
    children: [
      { label: "পরীক্ষার রুটিন", path: "/exam/routine" },
      { label: "পরীক্ষার ফলাফল", path: "/exam/results" },
    ],
  },
  { label: "ব্রাঞ্চ", path: "/branches" },
  { label: "নোটিশ", path: "/notices" },
  { label: "গ্যালারি", path: "/gallery" },
  { label: "ভর্তি", path: "/admission" },
  { label: "যোগাযোগ", path: "/contact" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const queryClient = useQueryClient();

  const prefetchBranches = () => {
    queryClient.prefetchQuery({
      queryKey: ["branches"],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("branches" as any)
          .select("*")
          .eq("is_active", true)
          .order("branch_name");
        if (error) throw error;
        return data;
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 no-print">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container flex items-center justify-between text-sm">
          <span>📞 +880 1912-888418 | 📧 bafamusicschool@gmail.com</span>
          <div className="flex gap-4">
            <Link to="/admin/login" className="hover:underline">
              শিক্ষক লগইন
            </Link>
            <span className="text-primary-foreground/50">|</span>
            <Link to="/admin/register" className="hover:underline">
              শিক্ষক/কর্মচারী রেজিস্ট্রেশন
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="BFA Logo" className="h-16 w-16 rounded-full object-cover" />
          <span className="hidden sm:inline font-semibold text-primary">বাংলাদেশ বুলবুল ললিতকলা একাডেমী বাফা</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) =>
            item.children ? (
              <DropdownMenu key={item.label}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-1 text-sm font-medium"
                  >
                    {item.label}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {item.children.map((child) => (
                    <DropdownMenuItem key={child.path} asChild>
                      <Link
                        to={child.path}
                        className={cn(
                          "w-full cursor-pointer",
                          isActive(child.path) && "bg-muted"
                        )}
                      >
                        {child.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={item.path}
                to={item.path!}
                onMouseEnter={item.path === "/branches" ? prefetchBranches : undefined}
              >
                <Button
                  variant="ghost"
                  className={cn(
                    "text-sm font-medium",
                    isActive(item.path!) &&
                    "bg-primary/10 text-primary"
                  )}
                >
                  {item.label}
                </Button>
              </Link>
            )
          )}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background animate-slide-in">
          <nav className="container py-4 space-y-2">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label} className="space-y-1">
                  <div className="px-3 py-2 text-sm font-semibold text-muted-foreground">
                    {item.label}
                  </div>
                  {item.children.map((child) => (
                    <Link
                      key={child.path}
                      to={child.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "block px-6 py-2 text-sm rounded-md hover:bg-muted",
                        isActive(child.path) && "bg-primary/10 text-primary"
                      )}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.path}
                  to={item.path!}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-3 py-2 text-sm font-medium rounded-md hover:bg-muted",
                    isActive(item.path!) && "bg-primary/10 text-primary"
                  )}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
