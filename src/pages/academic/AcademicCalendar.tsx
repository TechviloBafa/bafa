import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/client";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, BookOpen, Music, Palette, Theater, PartyPopper, Loader2 } from "lucide-react";

interface CalendarEvent {
  id: string;
  month: string;
  date: string;
  title: string;
  type: string;
  created_at: string;
}

const months = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
];

const getEventIcon = (type: string) => {
  switch (type) {
    case "holiday": return <PartyPopper className="h-4 w-4" />;
    case "cultural": return <Music className="h-4 w-4" />;
    case "exam": return <BookOpen className="h-4 w-4" />;
    case "event": return <Theater className="h-4 w-4" />;
    default: return <CalendarDays className="h-4 w-4" />;
  }
};

const getEventBadge = (type: string) => {
  switch (type) {
    case "holiday": return <Badge className="bg-red-500">ছুটি</Badge>;
    case "cultural": return <Badge className="bg-primary">সাংস্কৃতিক</Badge>;
    case "exam": return <Badge className="bg-amber-500">পরীক্ষা</Badge>;
    case "event": return <Badge className="bg-green-500">অনুষ্ঠান</Badge>;
    default: return <Badge variant="secondary">একাডেমিক</Badge>;
  }
};

export default function AcademicCalendar() {
  const { data: events, isLoading } = useQuery({
    queryKey: ["academic_calendar"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("academic_calendar" as any)
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data as any) as CalendarEvent[];
    },
    staleTime: 1000 * 30, // 30 seconds
  });

  const groupedEvents = events?.reduce((acc, event) => {
    if (!acc[event.month]) acc[event.month] = [];
    acc[event.month].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>) || {};

  return (
    <Layout>
      {/* Header */}
      <section className="hero-gradient py-16">
        <div className="container text-center text-primary-foreground">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/10 mb-4">
            <CalendarDays className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">একাডেমিক ক্যালেন্ডার</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            {new Date().getFullYear()}-{new Date().getFullYear() + 1} শিক্ষাবর্ষের সকল গুরুত্বপূর্ণ তারিখ ও অনুষ্ঠান
          </p>
        </div>
      </section>

      {/* Legend */}
      <section className="py-6 border-b">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-red-500">ছুটি</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-primary">সাংস্কৃতিক</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-500">পরীক্ষা</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500">অনুষ্ঠান</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar Grid */}
      <section className="py-16">
        <div className="container">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">ক্যালেন্ডার লোড হচ্ছে...</p>
            </div>
          ) : events?.length === 0 ? (
            <div className="text-center py-20">
              <CalendarDays className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold">কোনো ইভেন্ট পাওয়া যায়নি</h3>
              <p className="text-muted-foreground">শিগগিরই নতুন ইভেন্ট যোগ করা হবে।</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {months.map((month) => {
                const monthEvents = groupedEvents[month];
                if (!monthEvents) return null;

                return (
                  <Card key={month} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CalendarDays className="h-5 w-5 text-primary" />
                        {month}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        {monthEvents.map((event) => (
                          <div key={event.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              <span className="font-bold text-primary">{event.date}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">{event.title}</p>
                              <div className="mt-1">{getEventBadge(event.type)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
