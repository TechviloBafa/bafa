import { Users, GraduationCap, Award, Calendar } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "৫০০০+",
    label: "বর্তমান শিক্ষার্থী",
  },
  {
    icon: GraduationCap,
    value: "৫০০০+",
    label: "সফল স্নাতক",
  },
  {
    icon: Award,
    value: "১০০+",
    label: "জাতীয় পুরস্কার",
  },
  {
    icon: Calendar,
    value: "৩০+",
    label: "বছরের অভিজ্ঞতা",
  },
];

export function StatsSection() {
  return (
    <section className="py-16 hero-gradient">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="text-center text-primary-foreground space-y-3"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm mx-auto">
                  <Icon className="h-8 w-8" />
                </div>
                <div className="text-4xl md:text-5xl font-bold">{stat.value}</div>
                <div className="text-white/80 font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
