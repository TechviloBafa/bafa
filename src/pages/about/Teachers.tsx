import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/client";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Music, Palette, Theater, BookOpen } from "lucide-react";

interface Teacher {
  id: string;
  name: string;
  designation: string;
  qualification: string;
  experience: string;
  specialization: string;
  image_url: string;
  order_index: number;
}

const getIconForDesignation = (designation: string) => {
  if (designation.includes("সংগীত")) return Music;
  if (designation.includes("নৃত্য")) return BookOpen;
  if (designation.includes("চিত্রকলা")) return Palette;
  if (designation.includes("নাট্যকলা")) return Theater;
  return GraduationCap;
};

export default function Teachers() {
  const { data: teachers, isLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teachers" as any)
        .select("*")
        .eq("is_active", true)
        .order("order_index", { ascending: true });
      if (error) throw error;
      return (data as any) as Teacher[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <Layout>
      {/* Header */}
      <section className="hero-gradient py-16">
        <div className="container text-center text-primary-foreground">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/10 mb-4">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">শিক্ষক তথ্য</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            আমাদের অভিজ্ঞ ও নিবেদিতপ্রাণ শিক্ষকমণ্ডলীর সাথে পরিচিত হোন
          </p>
        </div>
      </section>

      {/* Teachers Grid */}
      <section className="py-16">
        <div className="container">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 w-full bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : !teachers || teachers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              কোনো তথ্য পাওয়া যায়নি
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers.map((teacher) => {
                const Icon = getIconForDesignation(teacher.designation);
                return (
                  <Card key={teacher.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0 overflow-hidden relative">
                          {teacher.image_url ? (
                            <img
                              src={teacher.image_url}
                              alt={teacher.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const fallback = e.currentTarget.parentElement?.querySelector('.fallback-icon');
                                if (fallback) fallback.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <Icon className={`h-8 w-8 text-primary fallback-icon ${teacher.image_url ? 'hidden' : ''}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{teacher.name}</CardTitle>
                          <CardDescription className="text-primary font-medium">
                            {teacher.designation}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">যোগ্যতা</p>
                        <p className="font-medium">{teacher.qualification || "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">অভিজ্ঞতা</p>
                        <p className="font-medium">{teacher.experience || "-"}</p>
                      </div>
                      {teacher.specialization && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">বিশেষত্ব</p>
                          <div className="flex flex-wrap gap-2">
                            {teacher.specialization.split(",").map((spec, i) => (
                              <Badge key={i} variant="secondary">
                                {spec.trim()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
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
