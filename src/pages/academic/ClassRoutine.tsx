import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Music, Palette, Theater, BookOpen, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/client";

const departments = [
  { id: "music", name: "সংগীত বিভাগ", icon: Music },
  { id: "art", name: "চিত্রকলা বিভাগ", icon: Palette },
  { id: "dance", name: "নৃত্য বিভাগ", icon: BookOpen },
  { id: "drama", name: "নাট্যকলা বিভাগ", icon: Theater },
];

interface ClassRoutine {
  id: string;
  department: string;
  day: string;
  morning_time: string;
  morning_class: string;
  afternoon_time: string;
  afternoon_class: string;
}

export default function ClassRoutine() {
  const { data: routines, isLoading } = useQuery({
    queryKey: ["public-class-routines"],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from("daily_class_routines" as any) // eslint-disable-line @typescript-eslint/no-explicit-any
        .select("*")
        .order("created_at"));
      if (error) throw error;
      return data as ClassRoutine[];
    },
  });

  const getDepartmentRoutine = (deptId: string) => {
    return routines?.filter(r => r.department === deptId) || [];
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="py-20 text-center">লোড হচ্ছে...</div>
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
          <Tabs defaultValue="music" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
              {departments.map((dept) => {
                const Icon = dept.icon;
                return (
                  <TabsTrigger key={dept.id} value={dept.id} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{dept.name}</span>
                    <span className="sm:hidden">{dept.name.split(" ")[0]}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {departments.map((dept) => {
              const Icon = dept.icon;
              const routine = getDepartmentRoutine(dept.id);

              return (
                <TabsContent key={dept.id} value={dept.id}>
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                      <CardTitle className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary" />
                        {dept.name} - সাপ্তাহিক রুটিন
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="font-bold">দিন</TableHead>
                              <TableHead className="font-bold">সময় (সকাল)</TableHead>
                              <TableHead className="font-bold">ক্লাস</TableHead>
                              <TableHead className="font-bold">সময় (বিকাল)</TableHead>
                              <TableHead className="font-bold">ক্লাস</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {routine.length > 0 ? (
                              routine.map((row, index) => (
                                <TableRow key={index} className="hover:bg-muted/50">
                                  <TableCell className="font-medium">{row.day}</TableCell>
                                  <TableCell className="text-primary">{row.morning_time}</TableCell>
                                  <TableCell>{row.morning_class}</TableCell>
                                  <TableCell className="text-primary">{row.afternoon_time}</TableCell>
                                  <TableCell>{row.afternoon_class}</TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                  কোনো রুটিন পাওয়া যায়নি
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Notes */}
                  <Card className="mt-6">
                    <CardContent className="pt-6">
                      <h3 className="font-bold mb-3">বিশেষ নোট:</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>শুক্রবার সাপ্তাহিক ছুটি</li>
                        <li>বিশেষ অনুষ্ঠানের সময় রুটিন পরিবর্তন হতে পারে</li>
                        <li>প্র্যাক্টিস রুমে অতিরিক্ত সময় পাওয়া যায় (আগে বুকিং করতে হবে)</li>
                        <li>পরীক্ষার সময় বিশেষ ক্লাস সিডিউল অনুসরণ করতে হবে</li>
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
