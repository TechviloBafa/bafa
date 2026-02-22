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
import { Plus, Pencil, Trash2, Loader2, Save } from "lucide-react";
import { withTimeout } from "@/utils/promiseUtils";

interface ClassRoutine {
    id: string;
    department: string;
    day: string;
    morning_time: string;
    morning_class: string;
    afternoon_time: string;
    afternoon_class: string;
}

const DEPARTMENTS = [
    { id: "music", name: "সংগীত" },
    { id: "art", name: "চিত্রকলা" },
    { id: "dance", name: "নৃত্য" },
    { id: "drama", name: "নাট্যকলা" },
];

const DAYS = ["শনিবার", "রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার"];

export default function AdminClassRoutine() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [selectedDept, setSelectedDept] = useState("music");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingRoutine, setEditingRoutine] = useState<ClassRoutine | null>(null);

    // Fetch Routines
    const { data: routines, isLoading } = useQuery({
        queryKey: ["daily-class-routines"],
        queryFn: async () => {
            const { data, error } = await (supabase
                .from("daily_class_routines" as any) // eslint-disable-line @typescript-eslint/no-explicit-any
                .select("*")
                .order("created_at"));
            if (error) throw error;
            return (data as any) as ClassRoutine[];
        },
    });

    // Add/Update Mutation
    const saveRoutineMutation = useMutation({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mutationFn: async (formData: any) => {
            if (editingRoutine) {
                const result = await withTimeout(
                    supabase
                        .from("daily_class_routines" as any) // eslint-disable-line @typescript-eslint/no-explicit-any
                        .update(formData)
                        .eq("id", editingRoutine.id),
                    30000,
                    "আপডেট করতে সময় বেশি লাগছে।"
                );
                if (result.error) throw result.error;
            } else {
                const result = await withTimeout(
                    supabase
                        .from("daily_class_routines" as any) // eslint-disable-line @typescript-eslint/no-explicit-any
                        .insert(formData),
                    30000,
                    "সেভ করতে সময় বেশি লাগছে।"
                );
                if (result.error) throw result.error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["daily-class-routines"] });
            toast({ title: "সফল", description: editingRoutine ? "রুটিন আপডেট করা হয়েছে" : "নতুন রুটিন যোগ করা হয়েছে" });
            setIsAddDialogOpen(false);
            setEditingRoutine(null);
        },
        onError: (error) => {
            toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
        }
    });

    // Delete Mutation
    const deleteRoutineMutation = useMutation({
        mutationFn: async (id: string) => {
            const result = await withTimeout(
                supabase
                    .from("daily_class_routines" as any) // eslint-disable-line @typescript-eslint/no-explicit-any
                    .delete()
                    .eq("id", id),
                30000,
                "মুছে ফেলতে সময় বেশি লাগছে।"
            );
            if (result.error) throw result.error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["daily-class-routines"] });
            toast({ title: "সফল", description: "রুটিন ডিলিট করা হয়েছে" });
        },
        onError: (error) => {
            toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
        }
    });

    const handleSaveRoutine = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const data = {
            department: selectedDept,
            day: formData.get("day"),
            morning_time: formData.get("morning_time"),
            morning_class: formData.get("morning_class"),
            afternoon_time: formData.get("afternoon_time"),
            afternoon_class: formData.get("afternoon_class"),
        };

        saveRoutineMutation.mutate(data);
    };

    const getDeptRoutines = (deptId: string) => {
        return routines?.filter(r => r.department === deptId) || [];
    };

    if (isLoading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <AdminLayout title="ক্লাস রুটিন ব্যবস্থাপনা">
            <div className="space-y-6">
                <Tabs value={selectedDept} onValueChange={setSelectedDept} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-8">
                        {DEPARTMENTS.map(dept => (
                            <TabsTrigger key={dept.id} value={dept.id}>{dept.name}</TabsTrigger>
                        ))}
                    </TabsList>

                    {DEPARTMENTS.map(dept => (
                        <TabsContent key={dept.id} value={dept.id}>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>{dept.name} বিভাগের রুটিন</CardTitle>
                                    <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
                                        setIsAddDialogOpen(open);
                                        if (!open) setEditingRoutine(null);
                                    }}>
                                        <DialogTrigger asChild>
                                            <Button onClick={() => setEditingRoutine(null)}>
                                                <Plus className="w-4 h-4 mr-2" /> নতুন যোগ করুন
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl">
                                            <DialogHeader>
                                                <DialogTitle>{editingRoutine ? "রুটিন এডিট করুন" : "নতুন রুটিন যোগ করুন"}</DialogTitle>
                                            </DialogHeader>
                                            <form onSubmit={handleSaveRoutine} className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>বার</Label>
                                                        <Select name="day" defaultValue={editingRoutine?.day || "শনিবার"}>
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {DAYS.map(day => (
                                                                    <SelectItem key={day} value={day}>{day}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>সকালের সময়</Label>
                                                        <Input name="morning_time" placeholder="যেমন: সকাল ১০-১২" defaultValue={editingRoutine?.morning_time} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>সকালের ক্লাস</Label>
                                                        <Input name="morning_class" placeholder="ক্লাসের নাম" defaultValue={editingRoutine?.morning_class} />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>বিকালের সময়</Label>
                                                        <Input name="afternoon_time" placeholder="যেমন: বিকাল ৩-৫" defaultValue={editingRoutine?.afternoon_time} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>বিকালের ক্লাস</Label>
                                                        <Input name="afternoon_class" placeholder="ক্লাসের নাম" defaultValue={editingRoutine?.afternoon_class} />
                                                    </div>
                                                </div>

                                                <Button type="submit" className="w-full" disabled={saveRoutineMutation.isPending}>
                                                    {saveRoutineMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                                    {editingRoutine ? "আপডেট করুন" : "সেভ করুন"}
                                                </Button>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </CardHeader>
                                <CardContent>
                                    <div className="border rounded-md overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-muted">
                                                <tr>
                                                    <th className="p-3">বার</th>
                                                    <th className="p-3">সকাল</th>
                                                    <th className="p-3">বিকাল</th>
                                                    <th className="p-3 text-right">অ্যাকশন</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {getDeptRoutines(dept.id).length === 0 ? (
                                                    <tr>
                                                        <td colSpan={4} className="p-4 text-center text-muted-foreground">কোনো রুটিন পাওয়া যায়নি</td>
                                                    </tr>
                                                ) : (
                                                    getDeptRoutines(dept.id).map(routine => (
                                                        <tr key={routine.id} className="border-t hover:bg-muted/50">
                                                            <td className="p-3 font-medium">{routine.day}</td>
                                                            <td className="p-3">
                                                                <div className="font-semibold text-primary">{routine.morning_time}</div>
                                                                <div className="text-muted-foreground">{routine.morning_class}</div>
                                                            </td>
                                                            <td className="p-3">
                                                                <div className="font-semibold text-primary">{routine.afternoon_time}</div>
                                                                <div className="text-muted-foreground">{routine.afternoon_class}</div>
                                                            </td>
                                                            <td className="p-3 text-right space-x-2">
                                                                <Button variant="ghost" size="icon" onClick={() => {
                                                                    setEditingRoutine(routine);
                                                                    setIsAddDialogOpen(true);
                                                                }}>
                                                                    <Pencil className="w-4 h-4 text-blue-500" />
                                                                </Button>
                                                                <Button variant="ghost" size="icon" onClick={() => {
                                                                    if (confirm("আপনি কি নিশ্চিত এই রুটিনটি ডিলিট করতে চান?")) {
                                                                        deleteRoutineMutation.mutate(routine.id);
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
