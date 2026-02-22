import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/client";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, Download, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function Notices() {
  const { data: notices, isLoading } = useQuery({
    queryKey: ["public-notices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notices")
        .select("id, title, category, created_at, is_new, content, has_attachment, attachment_url")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <Layout>
      {/* Header */}
      <section className="hero-gradient py-16">
        <div className="container text-center text-primary-foreground">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/10 mb-4">
            <Bell className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">নোটিশ বোর্ড</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            একাডেমীর সকল গুরুত্বপূর্ণ ঘোষণা ও বিজ্ঞপ্তি
          </p>
        </div>
      </section>

      {/* Notices List */}
      <section className="py-12">
        <div className="container max-w-4xl">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : notices?.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">কোনো নোটিশ নেই</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {notices?.map((notice) => (
                <Card
                  key={notice.id}
                  className="hover:shadow-lg transition-all duration-300 hover:border-primary/30"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      {/* Date Badge */}
                      <div className="shrink-0 text-center md:w-24">
                        <div className="inline-flex flex-col items-center justify-center bg-primary/10 rounded-lg p-3 md:w-full">
                          <Calendar className="h-5 w-5 text-primary mb-1" />
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {format(new Date(notice.created_at), "dd/MM/yyyy")}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
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
                        </div>

                        <h3 className="text-xl font-semibold">{notice.title}</h3>
                        <p className="text-muted-foreground">{notice.content}</p>

                        <div className="flex items-center gap-4 pt-2">
                          <Button variant="link" className="p-0 h-auto text-primary gap-1">
                            বিস্তারিত পড়ুন
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                          {notice.has_attachment && notice.attachment_url && (
                            <Button
                              variant="link"
                              className="p-0 h-auto text-muted-foreground gap-1"
                              asChild
                            >
                              <a href={notice.attachment_url} target="_blank" rel="noopener noreferrer">
                                <Download className="h-4 w-4" />
                                সংযুক্তি ডাউনলোড
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
