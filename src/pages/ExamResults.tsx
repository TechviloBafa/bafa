import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/client";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, FileText, Award, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { bnToEn } from "@/utils/numberUtils";

export default function ExamResults() {
  const [studentId, setStudentId] = useState("");
  const [examYear, setExamYear] = useState("");
  const [searchTriggered, setSearchTriggered] = useState(false);

  const { data: result, isLoading, isFetched } = useQuery({
    queryKey: ["public-result", studentId, examYear],
    queryFn: async () => {
      const normalizedStudentId = bnToEn(studentId.trim()).toUpperCase();
      const normalizedExamYear = bnToEn(examYear.trim());

      const { data, error } = await supabase
        .from("results")
        .select("*")
        .ilike("student_id", normalizedStudentId)
        .eq("exam_year", normalizedExamYear)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: searchTriggered && !!studentId && !!examYear,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTriggered(true);
  };

  const notFound = searchTriggered && isFetched && !isLoading && !result;

  return (
    <Layout>
      {/* Hero Section - Hidden on Print */}
      <section className="hero-gradient py-16 no-print">
        <div className="container text-center text-primary-foreground">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/10 mb-4">
            <FileText className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">পরীক্ষার ফলাফল</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            আপনার শিক্ষার্থী আইডি এবং পরীক্ষার বছর দিয়ে ফলাফল দেখুন
          </p>
        </div>
      </section>

      {/* Search Form - Hidden on Print */}
      <section className="py-12 no-print">
        <div className="container max-w-xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                ফলাফল অনুসন্ধান
              </CardTitle>
              <CardDescription>
                আপনার তথ্য দিয়ে ফলাফল খুঁজুন
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="studentId">শিক্ষার্থী আইডি</Label>
                  <Input
                    id="studentId"
                    value={studentId}
                    onChange={(e) => {
                      setStudentId(e.target.value);
                      setSearchTriggered(false);
                    }}
                    placeholder="যেমন: BLA-2024-001"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="examYear">পরীক্ষার বছর</Label>
                  <Select
                    value={examYear}
                    onValueChange={(value) => {
                      setExamYear(value);
                      setSearchTriggered(false);
                    }}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="বছর নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2026">২০২৬</SelectItem>
                      <SelectItem value="2025">২০২৫</SelectItem>
                      <SelectItem value="2024">২০২৪</SelectItem>
                      <SelectItem value="2023">২০২৩</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      খুঁজছি...
                    </>
                  ) : (
                    "ফলাফল দেখুন"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Result Display */}
      {result && (
        <section className="pb-16 pt-0 md:pt-8">
          <div className="container max-w-3xl">
            {/* Print Only Header */}
            <div className="hidden print:block text-center mb-8 border-b-2 border-primary pb-6">
              <div className="flex items-center justify-center gap-4 mb-2">
                <img src="/logo.png" alt="Logo" className="h-16 w-16" />
                <h1 className="text-3xl font-bold text-primary">বাংলাদেশ বুলবুল ললিতকলা একাডেমী বাফা</h1>
              </div>
              <p className="text-lg text-muted-foreground italic">শিল্প ও সংস্কৃতির মাধ্যমে মানবিক মূল্যবোধ ও সৃজনশীলতার বিকাশে নিবেদিত একটি প্রতিষ্ঠান</p>
              <div className="mt-4 text-xl font-semibold border-y py-2">পরীক্ষার ফলাফল - {result.exam_year}</div>
            </div>

            <Card className="border-2 border-secondary/30 print:border-none print:shadow-none">
              <CardHeader className="bg-secondary/10 border-b">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <CardTitle className="text-2xl">{result.student_name}</CardTitle>
                    <CardDescription className="text-base mt-1">
                      আইডি: {result.student_id} | কোর্স: {result.course}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-8 w-8 text-secondary" />
                    <div className="text-right">
                      <div className="text-3xl font-bold text-secondary">{result.grade}</div>
                      <div className="text-sm text-muted-foreground">
                        {result.gpa ? `GPA: ${result.gpa}` : "উত্তীর্ণ"}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">পরীক্ষার ধরন</p>
                    <p className="font-semibold">{result.exam_type}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">পরীক্ষার বছর</p>
                    <p className="font-semibold">{result.exam_year}</p>
                  </div>
                  {result.total_marks && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">মোট নম্বর</p>
                      <p className="font-semibold">{result.total_marks}</p>
                    </div>
                  )}
                  {result.gpa && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">জিপিএ</p>
                      <p className="font-semibold">{result.gpa}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-center no-print">
                  <Button variant="outline" onClick={() => window.print()}>
                    প্রিন্ট করুন
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Not Found */}
      {notFound && (
        <section className="pb-16">
          <div className="container max-w-xl">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>ফলাফল পাওয়া যায়নি</AlertTitle>
              <AlertDescription>
                দয়া করে সঠিক শিক্ষার্থী আইডি এবং পরীক্ষার বছর দিয়ে আবার চেষ্টা করুন।
              </AlertDescription>
            </Alert>
          </div>
        </section>
      )}
    </Layout>
  );
}
