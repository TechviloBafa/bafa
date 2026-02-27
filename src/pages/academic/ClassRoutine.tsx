import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Music, Palette, Theater, BookOpen, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/client";

import { COURSES } from "@/constants/courses";

interface ClassRoutineData {
  id: string;
  department: string;
  day: string;
  morning_time: string | null;
  morning_class: string | null;
  afternoon_time: string | null;
  afternoon_class: string | null;
}

export default function ClassRoutine() {
  const { data: routines, isLoading } = useQuery({
    queryKey: ["public-class-routines"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("daily_class_routines")
        .select("*")
        .order("created_at");
      if (error) throw error;
      return data as ClassRoutineData[];
    },
  });

  const getDepartmentRoutine = (deptId: string) => {
    return routines?.filter(r => r.department === deptId) || [];
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="py-20 text-center flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          রুটিন লোড হচ্ছে...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <section className="hero-gradient py-16">
        <div className="container text-center text-primary-foreground">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/10 mb-4">
            <Clock className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">ক্লাস রুটিন</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            বিভাগ অনুযায়ী সাপ্তাহিক ক্লাসের সময়সূচী
          </p>
        </div>
      </section>

      {/* Routine Tabs */}
      <section className="py-16">
        <div className="container">
          <Tabs defaultValue={COURSES[0].id} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mb-8 h-auto gap-2 bg-transparent p-0">
              {COURSES.map((dept) => {
                const Icon = dept.icon;
                return (
                  <TabsTrigger
                    key={dept.id}
                    value={dept.id}
                    className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border rounded-lg transition-all"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{dept.title}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {COURSES.map((dept) => {
              const Icon = dept.icon;
              const routine = getDepartmentRoutine(dept.id);

              return (
                <TabsContent key={dept.id} value={dept.id} className="mt-0 focus-visible:outline-none">
                  <Card className="border-2">
                    <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b">
                      <CardTitle className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary" />
                        {dept.title} বিভাগ - সাপ্তাহিক রুটিন
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                              <TableHead className="font-bold w-[120px]">দিন</TableHead>
                              <TableHead className="font-bold">সময় (সকাল)</TableHead>
                              <TableHead className="font-bold">ক্লাস</TableHead>
                              <TableHead className="font-bold">সময় (বিকাল)</TableHead>
                              <TableHead className="font-bold">ক্লাস</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {routine.length > 0 ? (
                              routine.map((row, index) => (
                                <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                                  <TableCell className="font-medium">{row.day}</TableCell>
                                  <TableCell className="text-primary font-semibold">{row.morning_time || "-"}</TableCell>
                                  <TableCell>{row.morning_class || "-"}</TableCell>
                                  <TableCell className="text-primary font-semibold">{row.afternoon_time || "-"}</TableCell>
                                  <TableCell>{row.afternoon_class || "-"}</TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground italic">
                                  এই বিভাগের জন্য কোনো রুটিন পাওয়া যায়নি
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Notes */}
                  <Card className="mt-6 border-dashed bg-muted/20">
                    <CardContent className="pt-6">
                      <h3 className="font-bold mb-3 flex items-center gap-2 text-primary">
                        <BookOpen className="h-4 w-4" />
                        বিশেষ দ্রষ্টব্য:
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
                        <li>সাধারণত শুক্রবার সাপ্তাহিক ছুটি থাকে, তবে বিশেষ ক্লাস হতে পারে।</li>
                        <li>রুটিনের যে কোনো পরিবর্তন নোটিশ বোর্ডে জানানো হবে।</li>
                        <li>প্র্যাক্টিস রুম ব্যবহারের জন্য সংশ্লিষ্ট বিভাগীয় প্রধানের অনুমতি প্রয়োজন।</li>
                        <li>ক্লাস শুরুর ৫ মিনিট আগে উপস্থিত থাকার জন্য অনুরোধ করা হলো।</li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}
