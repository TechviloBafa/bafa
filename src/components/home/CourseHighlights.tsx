import { Music, Palette, Theater, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const courses = [
  {
    icon: Music,
    title: "সংগীত বিভাগ",
    description: "রবীন্দ্রসংগীত, নজরুলগীতি, ভক্তিগীতি, আধুনিক গান ও যন্ত্রসংগীত শিক্ষা।",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Palette,
    title: "চিত্রকলা বিভাগ",
    description: "জলরং, তেলরং, পেন্সিল স্কেচ, ক্যালিগ্রাফি ও ডিজিটাল আর্ট প্রশিক্ষণ।",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: Theater,
    title: "নাট্যকলা বিভাগ",
    description: "মঞ্চ অভিনয়, স্ক্রিপ্ট লেখা, পরিচালনা ও প্রযোজনা শিক্ষা।",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: BookOpen,
    title: "নৃত্য বিভাগ",
    description: "ভরতনাট্যম, কত্থক, মণিপুরী, রবীন্দ্রনৃত্য ও লোকনৃত্য প্রশিক্ষণ।",
    color: "bg-gold/10 text-gold-foreground",
  },
];

export function CourseHighlights() {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">আমাদের বিভাগসমূহ</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            বিভিন্ন শিল্প মাধ্যমে পারদর্শিতা অর্জনের জন্য আমাদের বিশেষায়িত বিভাগসমূহ
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, index) => {
            const Icon = course.icon;
            return (
              <Card
                key={course.title}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/30"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-4">
                  <div className={`h-16 w-16 rounded-2xl ${course.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">{course.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{course.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
