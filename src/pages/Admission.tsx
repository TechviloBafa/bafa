import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Upload, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/client";
import { z } from "zod";

const courses = [
  "সংগীত (ভোকাল)",
  "সংগীত (যন্ত্র)",
  "চিত্রকলা",
  "নৃত্য",
  "নাট্যকলা",
];

// Validation schema
const admissionSchema = z.object({
  studentName: z.string().trim().min(1, "নাম আবশ্যক").max(100),
  fatherName: z.string().trim().min(1, "পিতার নাম আবশ্যক").max(100),
  motherName: z.string().trim().max(100).optional(),
  dateOfBirth: z.string().min(1, "জন্ম তারিখ আবশ্যক"),
  course: z.string().min(1, "কোর্স নির্বাচন আবশ্যক"),
  phone: z.string().trim().min(11, "সঠিক মোবাইল নম্বর দিন").max(15),
  email: z.string().email("সঠিক ইমেইল দিন").optional().or(z.literal("")),
  address: z.string().trim().max(500).optional(),
});

export default function Admission() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [formData, setFormData] = useState({
    studentName: "",
    fatherName: "",
    motherName: "",
    dateOfBirth: "",
    course: "",
    phone: "",
    email: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form data
    const result = admissionSchema.safeParse(formData);
    if (!result.success) {
      toast({
        title: "ফর্ম ত্রুটি",
        description: result.error.errors[0]?.message || "সকল তথ্য সঠিকভাবে পূরণ করুন।",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("admissions")
        .insert({
          student_name: formData.studentName.trim(),
          father_name: formData.fatherName.trim(),
          mother_name: formData.motherName.trim() || null,
          date_of_birth: formData.dateOfBirth,
          course: formData.course,
          phone: formData.phone.trim(),
          email: formData.email.trim() || null,
          address: formData.address.trim() || null,
          student_id: `TEMP-${Date.now()}`, // Will be overwritten by trigger
        })
        .select("student_id")
        .single();

      if (error) throw error;

      setStudentId(data.student_id);
      setSubmitted(true);
      toast({
        title: "আবেদন সফল হয়েছে!",
        description: "আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।",
      });
    } catch (error: unknown) {
      console.error("Admission error:", error);
      toast({
        title: "ত্রুটি!",
        description: "আবেদন জমা দিতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toBengaliNumber = (num: number) => {
    return num.toString().replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);
  };

  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const academicYear = `${toBengaliNumber(currentYear)}-${toBengaliNumber(nextYear)}`;

  if (submitted) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center py-16">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="pt-8 text-center space-y-4">
              <div className="h-20 w-20 mx-auto rounded-full bg-secondary/10 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold">আবেদন সফল হয়েছে!</h2>
              {studentId && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">আপনার আবেদন আইডি:</p>
                  <p className="text-xl font-bold text-primary">{studentId}</p>
                </div>
              )}
              <p className="text-muted-foreground">
                আপনার ভর্তি আবেদন সফলভাবে জমা হয়েছে। আমাদের টিম শীঘ্রই আপনার সাথে যোগাযোগ করবে।
              </p>
              <Button
                onClick={() => {
                  setSubmitted(false);
                  setStudentId("");
                  setFormData({
                    studentName: "",
                    fatherName: "",
                    motherName: "",
                    dateOfBirth: "",
                    course: "",
                    phone: "",
                    email: "",
                    address: "",
                  });
                }}
                variant="outline"
                className="mt-4"
              >
                নতুন আবেদন করুন
              </Button>
            </CardContent>
          </Card>
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
            <GraduationCap className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">অনলাইন ভর্তি আবেদন</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            {academicYear} শিক্ষাবর্ষে বুলবুল ললিতকলা একাডেমীতে ভর্তির জন্য নিচের ফর্মটি পূরণ করুন।
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-16">
        <div className="container max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>ভর্তি ফর্ম</CardTitle>
              <CardDescription>
                সকল তথ্য সঠিকভাবে বাংলায় পূরণ করুন। * চিহ্নিত ঘরগুলো আবশ্যক।
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="studentName">শিক্ষার্থীর নাম *</Label>
                    <Input
                      id="studentName"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleChange}
                      placeholder="সম্পূর্ণ নাম লিখুন"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">জন্ম তারিখ *</Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fatherName">পিতার নাম *</Label>
                    <Input
                      id="fatherName"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleChange}
                      placeholder="পিতার নাম লিখুন"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="motherName">মাতার নাম *</Label>
                    <Input
                      id="motherName"
                      name="motherName"
                      value={formData.motherName}
                      onChange={handleChange}
                      placeholder="মাতার নাম লিখুন"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="course">কোর্স নির্বাচন করুন *</Label>
                    <Select
                      value={formData.course}
                      onValueChange={(value) => setFormData({ ...formData, course: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="কোর্স নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course} value={course}>
                            {course}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">মোবাইল নম্বর *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="01XXXXXXXXX"
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">ইমেইল</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">ঠিকানা *</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="সম্পূর্ণ ঠিকানা লিখুন"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="photo">পাসপোর্ট সাইজ ছবি</Label>
                    <label
                      htmlFor="photo"
                      className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer block"
                    >
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        ছবি আপলোড করতে ক্লিক করুন
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        সর্বোচ্চ ফাইল সাইজ: ২MB (JPG, PNG)
                      </p>
                    </label>
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full md:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "জমা হচ্ছে..." : "আবেদন জমা দিন"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
