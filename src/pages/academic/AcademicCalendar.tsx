import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, BookOpen, Music, Palette, Theater, PartyPopper } from "lucide-react";

const calendarEvents = [
  {
    month: "জানুয়ারি",
    events: [
      { date: "০১", title: "নববর্ষ উদযাপন", type: "holiday" },
      { date: "১০", title: "বসন্ত উৎসব ও সরস্বতী পূজা", type: "cultural" },
      { date: "১৫", title: "ভর্তি পরীক্ষা", type: "exam" },
    ],
  },
  {
    month: "ফেব্রুয়ারি",
    events: [
      { date: "২১", title: "আন্তর্জাতিক মাতৃভাষা দিবস অনুষ্ঠান", type: "cultural" },
      { date: "২৫", title: "প্রথম সাময়িক পরীক্ষা শুরু", type: "exam" },
    ],
  },
  {
    month: "মার্চ",
    events: [
      { date: "০৭", title: "বঙ্গবন্ধুর ঐতিহাসিক ভাষণ দিবস", type: "cultural" },
      { date: "১৭", title: "বঙ্গবন্ধুর জন্মদিন উদযাপন", type: "cultural" },
      { date: "২৬", title: "স্বাধীনতা দিবস", type: "holiday" },
    ],
  },
  {
    month: "এপ্রিল",
    events: [
      { date: "১৪", title: "পহেলা বৈশাখ উদযাপন", type: "cultural" },
      { date: "২০", title: "বার্ষিক সাংস্কৃতিক প্রতিযোগিতা", type: "event" },
    ],
  },
  {
    month: "মে",
    events: [
      { date: "০১", title: "মে দিবস (ছুটি)", type: "holiday" },
      { date: "১৫", title: "দ্বিতীয় সাময়িক পরীক্ষা", type: "exam" },
    ],
  },
  {
    month: "জুন",
    events: [
      { date: "০১", title: "গ্রীষ্মকালীন ছুটি শুরু", type: "holiday" },
      { date: "৩০", title: "গ্রীষ্মকালীন ক্যাম্প সমাপ্তি", type: "event" },
    ],
  },
  {
    month: "জুলাই",
    events: [
      { date: "০১", title: "নতুন সেমিস্টার শুরু", type: "academic" },
      { date: "১৫", title: "রবীন্দ্র-নজরুল জয়ন্তী", type: "cultural" },
    ],
  },
  {
    month: "আগস্ট",
    events: [
      { date: "১৫", title: "জাতীয় শোক দিবস", type: "cultural" },
      { date: "২০", title: "ত্রৈমাসিক মূল্যায়ন", type: "exam" },
    ],
  },
  {
    month: "সেপ্টেম্বর",
    events: [
      { date: "১০", title: "শিক্ষক দিবস উদযাপন", type: "cultural" },
      { date: "২৫", title: "আন্তঃবিভাগীয় প্রতিযোগিতা", type: "event" },
    ],
  },
  {
    month: "অক্টোবর",
    events: [
      { date: "১০", title: "দুর্গাপূজার ছুটি", type: "holiday" },
      { date: "২৫", title: "তৃতীয় সাময়িক পরীক্ষা", type: "exam" },
    ],
  },
  {
    month: "নভেম্বর",
    events: [
      { date: "১০", title: "বার্ষিক সাংস্কৃতিক অনুষ্ঠান", type: "event" },
      { date: "২৫", title: "চূড়ান্ত পরীক্ষা শুরু", type: "exam" },
    ],
  },
  {
    month: "ডিসেম্বর",
    events: [
      { date: "১৬", title: "বিজয় দিবস উদযাপন", type: "cultural" },
      { date: "২০", title: "বার্ষিক পুরস্কার বিতরণী", type: "event" },
      { date: "২৫", title: "শীতকালীন ছুটি শুরু", type: "holiday" },
    ],
  },
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
            ২০২৪-২০২৫ শিক্ষাবর্ষের সকল গুরুত্বপূর্ণ তারিখ ও অনুষ্ঠান
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calendarEvents.map((month, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-primary" />
                    {month.month}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {month.events.map((event, eventIndex) => (
                      <div key={eventIndex} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
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
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
