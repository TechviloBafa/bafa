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
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, CalendarDays } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { withTimeout } from "@/utils/promiseUtils";

const months = [
    "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
    "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
];

const eventTypes = [
    { value: "holiday", label: "ছুটি" },
    { value: "cultural", label: "সাংস্কৃতিক" },
    { value: "exam", label: "পরীক্ষা" },
    { value: "event", label: "অনুষ্ঠান" },
    { value: "academic", label: "একাডেমিক" },
];

interface CalendarEvent {
    id: string;
    month: string;
    date: string;
    title: string;
    type: string;
    created_at: string;
}

export default function AdminAcademicCalendar() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
    const [formData, setFormData] = useState({
        month: "জানুয়ারি",
        date: "",
        title: "",
        type: "academic",
    });

    const { data: events, isLoading } = useQuery({
        queryKey: ["admin_academic_calendar"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("academic_calendar")
                .select("*")
                .order("created_at", { ascending: true });
            if (error) throw error;
            return data;
        },
        staleTime: 1000 * 30,
    });

    const createMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            const result = await withTimeout(
                supabase.from("academic_calendar" as any).insert([data]),
                30000,
                "ইভেন্ট সেভ করতে সময় বেশি লাগছে।"
            );
            if (result.error) throw result.error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin_academic_calendar"] });
            queryClient.invalidateQueries({ queryKey: ["academic_calendar"] });
            toast({ title: "সফল!", description: "ইভেন্ট সফলভাবে যোগ করা হয়েছে।" });
            resetForm();
        },
        onError: (error: Error) => {
            toast({
                title: "ত্রুটি!",
                description: error.message || "ইভেন্ট যোগ করতে ব্যর্থ হয়েছে।",
                variant: "destructive"
            });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
            const result = await withTimeout(
                supabase.from("academic_calendar" as any).update(data).eq("id", id),
                30000,
                "আপডেট করতে সময় বেশি লাগছে।"
            );
            if ((result as any).error) throw (result as any).error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin_academic_calendar"] });
            queryClient.invalidateQueries({ queryKey: ["academic_calendar"] });
            toast({ title: "সফল!", description: "ইভেন্ট আপডেট করা হয়েছে।" });
            resetForm();
        },
        onError: () => {
            toast({ title: "ত্রুটি!", description: "ইভেন্ট আপডেট করতে ব্যর্থ হয়েছে।", variant: "destructive" });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from("academic_calendar" as any).delete().eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin_academic_calendar"] });
            queryClient.invalidateQueries({ queryKey: ["academic_calendar"] });
            toast({ title: "সফল!", description: "ইভেন্ট মুছে ফেলা হয়েছে।" });
        },
        onError: () => {
            toast({ title: "ত্রুটি!", description: "ইভেন্ট মুছতে ব্যর্থ হয়েছে।", variant: "destructive" });
        },
    });

    const resetForm = () => {
        setFormData({ month: "জানুয়ারি", date: "", title: "", type: "academic" });
        setEditingEvent(null);
        setDialogOpen(false);
    };

    const handleEdit = (event: CalendarEvent) => {
        setEditingEvent(event);
        setFormData({
            month: event.month,
            date: event.date,
            title: event.title,
            type: event.type,
        });
        setDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingEvent) {
            updateMutation.mutate({ id: editingEvent.id, data: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const getEventBadge = (type: string) => {
        switch (type) {
            case "holiday": return <Badge className="bg-red-500">ছুটি</Badge>;
            case "cultural": return <Badge className="bg-primary">সাংস্কৃতিক</Badge>;
            case "exam": return <Badge className="bg-amber-500">পরীক্ষা</Badge>;
            case "event": return <Badge className="bg-green-500">অনুষ্ঠান</Badge>;
            default: return <Badge variant="secondary">একাডেমিক</Badge>;
        }
    };

    const groupedEvents = events?.reduce((acc, event) => {
        if (!acc[event.month]) acc[event.month] = [];
        acc[event.month].push(event);
        return acc;
    }, {} as Record<string, CalendarEvent[]>) || {};

    return (
        <AdminLayout title="একাডেমিক ক্যালেন্ডার">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <p className="text-muted-foreground">ক্যালেন্ডার ইভেন্টসমূহ পরিচালনা করুন</p>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => resetForm()}>
                                <Plus className="h-4 w-4 mr-2" />
                                নতুন ইভেন্ট
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingEvent ? "ইভেন্ট সম্পাদনা" : "নতুন ইভেন্ট যোগ করুন"}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="month">মাস</Label>
                                        <Select
                                            value={formData.month}
                                            onValueChange={(value) => setFormData({ ...formData, month: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {months.map((m) => (
                                                    <SelectItem key={m} value={m}>{m}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="date">তারিখ (যেমন: ০১ বা ১০-১৫)</Label>
                                        <Input
                                            id="date"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            placeholder="০১"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="title">ইভেন্ট শিরোনাম</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="নববর্ষ উদযাপন"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type">ধরণ</Label>
                                    <Select
                                        value={formData.type}
                                        onValueChange={(value) => setFormData({ ...formData, type: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {eventTypes.map((t) => (
                                                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex gap-2 pt-4">
                                    <Button type="submit" className="flex-1" disabled={createMutation.isPending || updateMutation.isPending}>
                                        {editingEvent ? "আপডেট করুন" : "যোগ করুন"}
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
                ) : events?.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">কোনো ইভেন্ট নেই</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6">
                        {months.map((month) => {
                            const monthEvents = groupedEvents[month];
                            if (!monthEvents) return null;

                            return (
                                <Card key={month}>
                                    <CardHeader className="py-3 bg-muted/30">
                                        <CardTitle className="text-md font-bold">{month}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="divide-y">
                                            {monthEvents.map((event) => (
                                                <div key={event.id} className="flex items-center justify-between p-4 hover:bg-muted/10 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                            <span className="font-bold text-primary">{event.date}</span>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{event.title}</p>
                                                            <div className="mt-1">{getEventBadge(event.type)}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button size="icon" variant="ghost" onClick={() => handleEdit(event)}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="text-destructive"
                                                            onClick={() => deleteMutation.mutate(event.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
