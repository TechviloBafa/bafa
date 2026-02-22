import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Calendar, Clock, AlertCircle } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/client";
import { format } from "date-fns";

interface ExamTerm {
  id: string;
  term_key: string;
  title: string;
  date_range: string;
}

interface ExamRoutine {
  id: string;
  term_id: string;
  exam_date: string;
  day: string;
  time: string;
  subject: string;
  department: string;
}

const getDepartmentBadge = (department: string) => {
  switch (department) {
    case "সংগীত": return <Badge className="bg-blue-500">{department}</Badge>;
    case "চিত্রকলা": return <Badge className="bg-purple-500">{department}</Badge>;
    case "নৃত্য": return <Badge className="bg-pink-500">{department}</Badge>;
    case "নাট্যকলা": return <Badge className="bg-amber-500">{department}</Badge>;
    case "সকল": return <Badge className="bg-green-500">{department}</Badge>;
    default: return <Badge variant="secondary">{department}</Badge>;
  }
};

export default function ExamRoutine() {
  const { data: terms, isLoading: termsLoading } = useQuery({
    queryKey: ["public-exam-terms"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exam_terms")
        .select("*")
        .eq("is_active", true)
        .order("created_at");
      if (error) throw error;
      return data as ExamTerm[];
    },
  });

  const { data: routines, isLoading: routinesLoading } = useQuery({
    queryKey: ["public-exam-routines"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exam_routines")
        .select("*")
        .order("exam_date");
      if (error) throw error;
      return data as ExamRoutine[];
    },
  });

  if (termsLoading || routinesLoading) {
    return (
      <Layout>
        <div className="py-20 text-center">লোড হচ্ছে...</div>
      </Layout>
    );
  }

  // Group routines by term
  const routinesByTerm = (termId: string) => {
    return routines?.filter(r => r.term_id === termId) || [];
  };

  return (
    <Layout>
      {/* Header */}
      <section className="hero-gradient py-16">
        <div className="container text-center text-primary-foreground">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/10 mb-4">
            <ClipboardList className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">পরীক্ষার রুটিন</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            ২০২৪-২০২৫ শিক্ষাবর্ষের পরীক্ষার সময়সূচী
          </p>
        </div>
      </section>

      {/* Exam Routine Tabs */}
      <section className="py-16">
        <div className="container">
          {terms && terms.length > 0 ? (
            <Tabs defaultValue={terms[0].term_key} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                {terms.map(term => (
                  <TabsTrigger key={term.id} value={term.term_key}>{term.title}</TabsTrigger>
                ))}
              </TabsList>

              {terms.map(term => {
                const termRoutines = routinesByTerm(term.id);
                return (
                  <TabsContent key={term.id} value={term.term_key}>
                    <Card>
                      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                        <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <span className="flex items-center gap-2">
                            <ClipboardList className="h-5 w-5 text-primary" />
                            {term.title}
                          </span>
                          <Badge variant="outline" className="flex items-center gap-1 w-fit">
                            <Calendar className="h-3 w-3" />
                            {term.date_range}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="font-bold">তারিখ</TableHead>
                                <TableHead className="font-bold">বার</TableHead>
                                <TableHead className="font-bold">সময়</TableHead>
                                <TableHead className="font-bold">বিষয়</TableHead>
                                <TableHead className="font-bold">বিভাগ</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {termRoutines.length > 0 ? (
                                termRoutines.map((exam, index) => (
                                  <TableRow key={index} className="hover:bg-muted/50">
                                    <TableCell className="font-medium">
                                      {format(new Date(exam.exam_date), "dd MMM yyyy")}
                                    </TableCell>
                                    <TableCell>{exam.day}</TableCell>
                                    <TableCell className="flex items-center gap-1">
                                      <Clock className="h-4 w-4 text-primary" />
                                      {exam.time}
                                    </TableCell>
                                    <TableCell className="font-medium">{exam.subject}</TableCell>
                                    <TableCell>{getDepartmentBadge(exam.department)}</TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                    কোনো পরীক্ষার রুটিন পাওয়া যায়নি
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                );
              })}
            </Tabs>
          ) : (
            <div className="text-center text-muted-foreground p-10 border rounded-lg bg-muted/20">
              বর্তমানে কোনো পরীক্ষার রুটিন প্রকাশিত হয়নি
            </div>
          )}

          {/* Important Notes */}
          <Card className="mt-8 border-amber-200 bg-amber-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-800">
                <AlertCircle className="h-5 w-5" />
                গুরুত্বপূর্ণ নির্দেশনা
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-amber-900">
                <li>পরীক্ষার হলে ৩০ মিনিট আগে উপস্থিত থাকতে হবে</li>
                <li>প্রবেশপত্র ও ছাত্র পরিচয়পত্র অবশ্যই সাথে আনতে হবে</li>
                <li>প্র্যাক্টিক্যাল পরীক্ষায় নিজস্ব যন্ত্র/সরঞ্জাম আনতে হবে</li>
                <li>মোবাইল ফোন পরীক্ষার হলে সম্পূর্ণ নিষিদ্ধ</li>
                <li>কোনো পরিবর্তন হলে নোটিশ বোর্ডে জানানো হবে</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
