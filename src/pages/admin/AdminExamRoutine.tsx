import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Calendar, Clock, Save, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { withTimeout } from "@/utils/promiseUtils";

interface ExamTerm {
    id: string;
    term_key: string;
    title: string;
    date_range: string;
    is_active: boolean;
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

const DEPARTMENTS = ["সংগীত", "চিত্রকলা", "নৃত্য", "নাট্যকলা", "সকল"];

export default function AdminExamRoutine() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [selectedTerm, setSelectedTerm] = useState("first_term");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingExam, setEditingExam] = useState<ExamRoutine | null>(null);

    // Fetch Terms
    const { data: terms, isLoading: termsLoading } = useQuery({
        queryKey: ["exam-terms"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("exam_terms" as any)
                .select("*")
                .order("created_at");
            if (error) throw error;
            return (data as any) as ExamTerm[];
        },
    });

    // Fetch Routines
    const { data: routines, isLoading: routinesLoading } = useQuery({
        queryKey: ["exam-routines"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("exam_routines" as any)
                .select("*")
                .order("exam_date");
            if (error) throw error;
            return (data as any) as ExamRoutine[];
        },
    });

    // Mutation to update Term Info
    const updateTermMutation = useMutation({
        mutationFn: async ({ id, title, date_range }: { id: string; title: string, date_range: string }) => {
            const result = await withTimeout(
                supabase
                    .from("exam_terms" as any)
                    .update({ title, date_range })
                    .eq("id", id),
                30000,
                "আপডেট করতে সময় বেশি লাগছে।"
            );
            if (result.error) throw result.error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["exam-terms"] });
            toast({ title: "সফল", description: "পরীক্ষার তথ্য আপডেট করা হয়েছে" });
        },
        onError: (error) => {
            toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
        }
    });

    // Mutation to Add/Update Exam
    const saveExamMutation = useMutation({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mutationFn: async (formData: any) => {
            if (editingExam) {
                const result = await withTimeout(
                    supabase
                        .from("exam_routines" as any)
                        .update(formData)
                        .eq("id", editingExam.id),
                    30000,
                    "আপডেট করতে সময় বেশি লাগছে।"
                );
                if (result.error) throw result.error;
            } else {
                const result = await withTimeout(
                    supabase
                        .from("exam_routines" as any)
                        .insert(formData),
                    30000,
                    "সেভ করতে সময় বেশি লাগছে।"
                );
                if (result.error) throw result.error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["exam-routines"] });
            toast({ title: "সফল", description: editingExam ? "রুটিন আপডেট করা হয়েছে" : "নতুন রুটিন যোগ করা হয়েছে" });
            setIsAddDialogOpen(false);
            setEditingExam(null);
        },
        onError: (error) => {
            toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
        }
    });

    // Mutation to Delete Exam
    const deleteExamMutation = useMutation({
        mutationFn: async (id: string) => {
            const result = await withTimeout(
                supabase
                    .from("exam_routines" as any)
                    .delete()
                    .eq("id", id),
                30000,
                "মুছে ফেলতে সময় বেশি লাগছে।"
            );
            if (result.error) throw result.error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["exam-routines"] });
            toast({ title: "সফল", description: "রুটিন ডিলিট করা হয়েছে" });
        },
    });

    const activeTermData = terms?.find(t => t.term_key === selectedTerm);
    const activeRoutines = routines?.filter(r => r.term_id === activeTermData?.id) || [];

    const handleSaveExam = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!activeTermData) return;

        const form = e.currentTarget;
        const formData = new FormData(form);

        const data = {
            term_id: activeTermData.id,
            exam_date: formData.get("exam_date"),
            day: formData.get("day"),
            time: formData.get("time"),
            subject: formData.get("subject"),
            department: formData.get("department"),
        };

        saveExamMutation.mutate(data);
    };

    const handleUpdateTerm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!activeTermData) return;
        const formData = new FormData(e.currentTarget);
        updateTermMutation.mutate({
            id: activeTermData.id,
            title: formData.get("title") as string,
            date_range: formData.get("date_range") as string
        });
    }

    if (termsLoading || routinesLoading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <AdminLayout title="পরীক্ষার রুটিন ব্যবস্থাপনা">
            <div className="space-y-6">
                <Tabs value={selectedTerm} onValueChange={setSelectedTerm} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-8">
                        {terms?.map(term => (
                            <TabsTrigger key={term.id} value={term.term_key}>{term.title}</TabsTrigger>
                        ))}
                    </TabsList>

                    {terms?.map(term => (
                        <TabsContent key={term.id} value={term.term_key} className="space-y-6">
                            {/* Term Settings */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>পরীক্ষার তথ্য</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleUpdateTerm} className="flex flex-col md:flex-row gap-4 items-end">
                                        <div className="w-full md:w-1/2 space-y-2">
                                            <Label>পরীক্ষার নাম</Label>
                                            <Input name="title" defaultValue={term.title} required />
                                        </div>
                                        <div className="w-full md:w-1/3 space-y-2">
                                            <Label>সময়কাল (Date Range)</Label>
                                            <Input name="date_range" defaultValue={term.date_range} required />
                                        </div>
                                        <Button type="submit" disabled={updateTermMutation.isPending}>
                                            {updateTermMutation.isPending ? <Loader2 className="animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                            আপডেট
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>

                            {/* Routines Table */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>রুটিন তালিকা</CardTitle>
                                    <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
                                        setIsAddDialogOpen(open);
                                        if (!open) setEditingExam(null);
                                    }}>
                                        <DialogTrigger asChild>
                                            <Button onClick={() => setEditingExam(null)}>
                                                <Plus className="w-4 h-4 mr-2" /> নতুন যোগ করুন
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>{editingExam ? "রুটিন এডিট করুন" : "নতুন রুটিন যোগ করুন"}</DialogTitle>
                                            </DialogHeader>
                                            <form onSubmit={handleSaveExam} className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>তারিখ</Label>
                                                        <Input name="exam_date" type="date" defaultValue={editingExam?.exam_date} required />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>বার</Label>
                                                        <Input name="day" placeholder="যেমন: শনিবার" defaultValue={editingExam?.day} required />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>সময়</Label>
                                                        <Input name="time" placeholder="সকাল ১০:০০" defaultValue={editingExam?.time} required />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>বিভাগ</Label>
                                                        <Select name="department" defaultValue={editingExam?.department || "সকল"}>
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {DEPARTMENTS.map(dept => (
                                                                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>বিষয়</Label>
                                                    <Input name="subject" placeholder="বিষয়ের নাম" defaultValue={editingExam?.subject} required />
                                                </div>
                                                <Button type="submit" className="w-full" disabled={saveExamMutation.isPending}>
                                                    {saveExamMutation.isPending ? "সেভ হচ্ছে..." : "সেভ করুন"}
                                                </Button>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </CardHeader>
                                <CardContent>
                                    <div className="border rounded-md">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-muted">
                                                <tr>
                                                    <th className="p-3">তারিখ & বার</th>
                                                    <th className="p-3">সময়</th>
                                                    <th className="p-3">বিষয়</th>
                                                    <th className="p-3">বিভাগ</th>
                                                    <th className="p-3 text-right">অ্যাকশন</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {activeRoutines.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={5} className="p-4 text-center text-muted-foreground">কোনো রুটিন পাওয়া যায়নি</td>
                                                    </tr>
                                                ) : (
                                                    activeRoutines.map(routine => (
                                                        <tr key={routine.id} className="border-t hover:bg-muted/50">
                                                            <td className="p-3">
                                                                <div className="font-medium">{format(new Date(routine.exam_date), "dd MMM yyyy")}</div>
                                                                <div className="text-xs text-muted-foreground">{routine.day}</div>
                                                            </td>
                                                            <td className="p-3">{routine.time}</td>
                                                            <td className="p-3 font-medium">{routine.subject}</td>
                                                            <td className="p-3">
                                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                                                    {routine.department}
                                                                </span>
                                                            </td>
                                                            <td className="p-3 text-right space-x-2">
                                                                <Button variant="ghost" size="icon" onClick={() => {
                                                                    setEditingExam(routine);
                                                                    setIsAddDialogOpen(true);
                                                                }}>
                                                                    <Pencil className="w-4 h-4 text-blue-500" />
                                                                </Button>
                                                                <Button variant="ghost" size="icon" onClick={() => {
                                                                    if (confirm("আপনি কি নিশ্চিত এই রুটিনটি ডিলিট করতে চান?")) {
                                                                        deleteExamMutation.mutate(routine.id);
                                                                    }
                                                                }}>
                                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </AdminLayout>
    );
}
