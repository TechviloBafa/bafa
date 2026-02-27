import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { withTimeout } from "@/utils/promiseUtils";
import { bnToEn } from "@/utils/numberUtils";

import { COURSES } from "@/constants/courses";

const courses = COURSES.map(course => course.title);
const examTypes = ["অর্ধবার্ষিক", "বার্ষিক", "সাময়িক"];
const grades = ["A+", "A", "A-", "B", "C", "D", "F"];

interface Result {
  id: string;
  student_id: string;
  student_name: string;
  course: string;
  exam_type: string;
  exam_year: string;
  total_marks: number | null;
  gpa: number | null;
  grade: string | null;
  created_at: string;
}

export default function AdminResults() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<Result | null>(null);
  const [formData, setFormData] = useState({
    student_id: "",
    student_name: "",
    course: "সংগীত",
    exam_type: "বার্ষিক",
    exam_year: new Date().getFullYear().toString(),
    total_marks: 0,
    gpa: 0,
    grade: "A",
  });

  const { data: results, isLoading } = useQuery({
    queryKey: ["admin-results"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("results")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        throw new Error("আপনাকে প্রথমে লগইন করতে হবে।");
      }
      const result = await withTimeout(
        supabase.from("results").insert([{ ...data, marks: {} }]),
        30000,
        "ফলাফল সেভ করতে সময় বেশি লাগছে।"
      );
      if (result.error) throw result.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-results"] });
      toast({ title: "সফল!", description: "ফলাফল সফলভাবে যোগ করা হয়েছে।" });
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "ত্রুটি!",
        description: error.message || "ফলাফল যোগ করতে ব্যর্থ হয়েছে। আপনি কি এডমিন হিসেবে লগইন করেছেন?",
        variant: "destructive"
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        throw new Error("আপনাকে প্রথমে লগইন করতে হবে।");
      }
      const result = await withTimeout(
        supabase.from("results").update(data).eq("id", id),
        30000,
        "আপডেট করতে সময় বেশি লাগছে।"
      );
      if (result.error) throw result.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-results"] });
      toast({ title: "সফল!", description: "ফলাফল আপডেট করা হয়েছে।" });
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "ত্রুটি!",
        description: error.message || "ফলাফল আপডেট করতে ব্যর্থ হয়েছে।",
        variant: "destructive"
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        throw new Error("আপনাকে প্রথমে লগইন করতে হবে।");
      }
      const result = await withTimeout(
        supabase.from("results").delete().eq("id", id),
        30000,
        "মুছে ফেলতে সময় বেশি লাগছে।"
      );
      if (result.error) throw result.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-results"] });
      toast({ title: "সফল!", description: "ফলাফল মুছে ফেলা হয়েছে।" });
    },
    onError: (error: Error) => {
      toast({
        title: "ত্রুটি!",
        description: error.message || "ফলাফল মুছতে ব্যর্থ হয়েছে।",
        variant: "destructive"
      });
    },
  });

  const resetForm = () => {
    setFormData({
      student_id: "",
      student_name: "",
      course: "সংগীত",
      exam_type: "বার্ষিক",
      exam_year: new Date().getFullYear().toString(),
      total_marks: 0,
      gpa: 0,
      grade: "A",
    });
    setEditingResult(null);
    setDialogOpen(false);
  };

  const handleEdit = (result: Result) => {
    setEditingResult(result);
    setFormData({
      student_id: result.student_id,
      student_name: result.student_name,
      course: result.course,
      exam_type: result.exam_type,
      exam_year: result.exam_year,
      total_marks: result.total_marks || 0,
      gpa: result.gpa || 0,
      grade: result.grade || "A",
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedData = {
      ...formData,
      student_id: bnToEn(formData.student_id).trim().toUpperCase(),
      exam_year: bnToEn(formData.exam_year).trim(),
    };

    if (editingResult) {
      updateMutation.mutate({ id: editingResult.id, data: normalizedData });
    } else {
      createMutation.mutate(normalizedData);
    }
  };

  return (
    <AdminLayout title="ফলাফল ব্যবস্থাপনা">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">শিক্ষার্থীদের ফলাফল পরিচালনা করুন</p>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                নতুন ফলাফল
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingResult ? "ফলাফল সম্পাদনা" : "নতুন ফলাফল যোগ করুন"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="student_id">শিক্ষার্থী আইডি</Label>
                    <Input
                      id="student_id"
                      value={formData.student_id}
                      onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student_name">শিক্ষার্থীর নাম</Label>
                    <Input
                      id="student_name"
                      value={formData.student_name}
                      onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>কোর্স</Label>
                    <Select
                      value={formData.course}
                      onValueChange={(value) => setFormData({ ...formData, course: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
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
                    <Label>পরীক্ষার ধরন</Label>
                    <Select
                      value={formData.exam_type}
                      onValueChange={(value) => setFormData({ ...formData, exam_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {examTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="exam_year">পরীক্ষার বছর</Label>
                    <Input
                      id="exam_year"
                      value={formData.exam_year}
                      onChange={(e) => setFormData({ ...formData, exam_year: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="total_marks">মোট নম্বর</Label>
                    <Input
                      id="total_marks"
                      type="number"
                      value={formData.total_marks}
                      onChange={(e) => setFormData({ ...formData, total_marks: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gpa">জিপিএ</Label>
                    <Input
                      id="gpa"
                      type="number"
                      step="0.01"
                      value={formData.gpa}
                      onChange={(e) => setFormData({ ...formData, gpa: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>গ্রেড</Label>
                  <Select
                    value={formData.grade}
                    onValueChange={(value) => setFormData({ ...formData, grade: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingResult ? "আপডেট করুন" : "যোগ করুন"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    বাতিল
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-8">লোড হচ্ছে...</div>
        ) : results?.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">কোনো ফলাফল নেই</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>আইডি</TableHead>
                    <TableHead>নাম</TableHead>
                    <TableHead>কোর্স</TableHead>
                    <TableHead>পরীক্ষা</TableHead>
                    <TableHead>বছর</TableHead>
                    <TableHead>গ্রেড</TableHead>
                    <TableHead className="text-right">কার্যক্রম</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results?.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">{result.student_id}</TableCell>
                      <TableCell>{result.student_name}</TableCell>
                      <TableCell>{result.course}</TableCell>
                      <TableCell>{result.exam_type}</TableCell>
                      <TableCell>{result.exam_year}</TableCell>
                      <TableCell>{result.grade}</TableCell>
                      <TableCell className="text-right">
                        <Button size="icon" variant="ghost" onClick={() => handleEdit(result)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => deleteMutation.mutate(result.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
