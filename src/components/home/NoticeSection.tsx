import { Link } from "react-router-dom";
import { Bell, ArrowRight, Calendar, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/client";
import { format } from "date-fns";

interface Notice {
  id: string;
  title: string;
  category: string;
  created_at: string;
  is_new: boolean;
}

export function NoticeSection() {
  const { data: notices, isLoading } = useQuery({
    queryKey: ["home-notices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notices" as any)
        .select("id, title, category, created_at, is_new")
        .order("created_at", { ascending: false })
        .limit(4);
      if (error) throw error;
      return data as Notice[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">সাম্প্রতিক নোটিশ</h2>
              <p className="text-muted-foreground">একাডেমীর সর্বশেষ ঘোষণা</p>
            </div>
          </div>
          <Link to="/notices">
            <Button variant="outline" className="gap-2">
              সব নোটিশ দেখুন
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : notices?.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">কোনো নোটিশ নেই</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {notices?.map((notice, index) => (
              <Link key={notice.id} to="/notices">
                <Card
                  className="group hover:shadow-lg transition-all duration-300 hover:border-primary/30 cursor-pointer h-full"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant={notice.is_new ? "default" : "secondary"}
                            className={notice.is_new ? "bg-primary" : ""}
                          >
                            {notice.category}
                          </Badge>
                          {notice.is_new && (
                            <Badge variant="outline" className="text-accent border-accent">
                              নতুন
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                          {notice.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(notice.created_at), "dd/MM/yyyy")}</span>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
