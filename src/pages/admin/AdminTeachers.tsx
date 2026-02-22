import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2, GraduationCap, Search, MoveUp, MoveDown } from "lucide-react";
import { supabase } from "@/integrations/client";
import { toast } from "sonner";
import { withTimeout } from "@/utils/promiseUtils";

interface Teacher {
    id: string;
    name: string;
    designation: string;
    qualification: string | null;
    experience: string | null;
    specialization: string | null;
    image_url: string | null;
    is_active: boolean | null;
    order_index: number;
    created_at: string;
}

interface TeacherFormData {
    name: string;
    designation: string;
    qualification: string;
    experience: string;
    specialization: string;
    image_url: string;
    is_active: boolean;
    order_index: number;
}

const initialFormData: TeacherFormData = {
    name: "",
    designation: "",
    qualification: "",
    experience: "",
    specialization: "",
    image_url: "",
    is_active: true,
    order_index: 0,
};

export default function AdminTeachers() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
    const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);
    const [formData, setFormData] = useState<TeacherFormData>(initialFormData);

    const queryClient = useQueryClient();

    const { data: teachers, isLoading } = useQuery({
        queryKey: ["admin-teachers"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("teachers" as any)
                .select("*")
                .order("order_index", { ascending: true });
            if (error) throw error;
            return (data as any) as Teacher[];
        },
    });

    const createMutation = useMutation({
        mutationFn: async (data: TeacherFormData) => {
            const result = await withTimeout(
                supabase.from("teachers" as any).insert([data]),
                30000,
                "শিক্ষক যোগ করতে সময় বেশি লাগছে।"
            );
            if (result.error) throw result.error;
            return result.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-teachers"] });
            toast.success("শিক্ষক সফলভাবে যোগ করা হয়েছে");
            handleCloseDialog();
        },
        onError: (error: any) => {
            toast.error(`ভুল: ${error.message}`);
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: TeacherFormData }) => {
            const result = await withTimeout(
                supabase.from("teachers" as any).update(data).eq("id", id),
                30000,
                "আপডেট করতে সময় বেশি লাগছে।"
            );
            if (result.error) throw result.error;
            return result.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-teachers"] });
            toast.success("তথ্য সফলভাবে আপডেট করা হয়েছে");
            handleCloseDialog();
        },
        onError: (error: any) => {
            toast.error(`ভুল: ${error.message}`);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const result = await withTimeout(
                supabase.from("teachers" as any).delete().eq("id", id),
                30000,
                "মুছে ফেলতে সময় বেশি লাগছে।"
            );
            if (result.error) throw result.error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-teachers"] });
            toast.success("শিক্ষক সফলভাবে মুছে ফেলা হয়েছে");
            setIsDeleteAlertOpen(false);
            setTeacherToDelete(null);
        },
        onError: (error: any) => {
            toast.error(`ভুল: ${error.message}`);
        },
    });

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingTeacher(null);
        setFormData(initialFormData);
    };

    const handleEdit = (teacher: Teacher) => {
        setEditingTeacher(teacher);
        setFormData({
            name: teacher.name,
            designation: teacher.designation,
            qualification: teacher.qualification || "",
            experience: teacher.experience || "",
            specialization: teacher.specialization || "",
            image_url: teacher.image_url || "",
            is_active: teacher.is_active ?? true,
            order_index: teacher.order_index,
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTeacher) {
            updateMutation.mutate({ id: editingTeacher.id, data: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const filteredTeachers = teachers?.filter(
        (t) =>
            t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.designation.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout title="শিক্ষক ব্যবস্থাপনা">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="শিক্ষক খুঁজুন..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Button onClick={() => setIsDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        নতুন শিক্ষক যোগ করুন
                    </Button>
                </div>

                <div className="bg-card border rounded-lg overflow-hidden">
                    {isLoading ? (
                        <div className="p-6 space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full" />
                            ))}
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>নাম ও পদবী</TableHead>
                                    <TableHead className="hidden md:table-cell">যোগ্যতা ও অভিজ্ঞতা</TableHead>
                                    <TableHead>স্ট্যাটাস</TableHead>
                                    <TableHead>ক্রম</TableHead>
                                    <TableHead className="text-right">অ্যাকশন</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTeachers?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            কোনো শিক্ষক পাওয়া যায়নি
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredTeachers?.map((teacher) => (
                                        <TableRow key={teacher.id}>
                                            <TableCell>
                                                <div className="font-medium text-primary">{teacher.name}</div>
                                                <div className="text-sm text-muted-foreground">{teacher.designation}</div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell text-sm">
                                                <div>{teacher.qualification}</div>
                                                <div className="text-muted-foreground">{teacher.experience}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={teacher.is_active ? "default" : "secondary"}>
                                                    {teacher.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{teacher.order_index}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleEdit(teacher)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() => {
                                                            setTeacherToDelete(teacher);
                                                            setIsDeleteAlertOpen(true);
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingTeacher ? "শিক্ষক তথ্য সম্পাদনা" : "নতুন শিক্ষক যোগ করুন"}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">নাম *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="designation">পদবী *</Label>
                                <Input
                                    id="designation"
                                    value={formData.designation}
                                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="qualification">শিক্ষাগত যোগ্যতা</Label>
                                <Input
                                    id="qualification"
                                    value={formData.qualification}
                                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="experience">অভিজ্ঞতা</Label>
                                <Input
                                    id="experience"
                                    value={formData.experience}
                                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="specialization">বিশেষত্ব (কমা দিয়ে লিখুন)</Label>
                            <Input
                                id="specialization"
                                value={formData.specialization}
                                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                placeholder="রবীন্দ্রসংগীত, ধ্রুপদী সংগীত"
                            />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="image_url">ছবির URL</Label>
                                <Input
                                    id="image_url"
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    placeholder="/teachers/name.jpg"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="order_index">সাজানোর ক্রম (Order)</Label>
                                <Input
                                    id="order_index"
                                    type="number"
                                    value={formData.order_index}
                                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Switch
                                id="is_active"
                                checked={formData.is_active}
                                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                            />
                            <Label htmlFor="is_active">সক্রিয় শিক্ষক</Label>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={handleCloseDialog}>
                                বাতিল
                            </Button>
                            <Button
                                type="submit"
                                disabled={createMutation.isPending || updateMutation.isPending}
                            >
                                {createMutation.isPending || updateMutation.isPending
                                    ? "সংরক্ষণ হচ্ছে..."
                                    : editingTeacher
                                        ? "আপডেট করুন"
                                        : "যোগ করুন"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>তথ্য মুছে ফেলতে চান?</AlertDialogTitle>
                        <AlertDialogDescription>
                            আপনি কি নিশ্চিত যে আপনি "{teacherToDelete?.name}"-এর তথ্য মুছে ফেলতে চান?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>বাতিল</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => teacherToDelete && deleteMutation.mutate(teacherToDelete.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleteMutation.isPending ? "মুছে ফেলা হচ্ছে..." : "মুছে ফেলুন"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
