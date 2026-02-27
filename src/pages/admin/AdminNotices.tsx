import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Pencil, Trash2, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { queryKeys } from "@/constants/queryKeys";
import { withTimeout } from "@/utils/promiseUtils";

const categories = ["সাধারণ", "পরীক্ষা", "ভর্তি", "ছুটি", "অন্যান্য"];

interface Notice {
  id: string;
  title: string;
  content: string;
  category: string;
  is_new: boolean;
  created_at: string;
}

export default function AdminNotices() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "সাধারণ",
    is_new: true,
  });

  const { data: notices, isLoading, error } = useQuery({
    queryKey: queryKeys.notices.admin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notices")
        .select("id, title, category, created_at, is_new, content")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 30, // 30 seconds
    meta: {
      onError: () => {
        toast({
          title: "ত্রুটি!",
          description: "নোটিশ লোড করতে সমস্যা হয়েছে।",
          variant: "destructive",
        });
      },
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const result = await withTimeout(
        supabase.from("notices").insert([data]),
        30000,
        "নোটিশ সেভ করতে সময় বেশি লাগছে। দয়া করে ইন্টারনেট চেক করুন।"
      );
      if (result.error) throw result.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notices.admin });
      queryClient.invalidateQueries({ queryKey: ["home-notices"] });
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      toast({ title: "সফল!", description: "নোটিশ সফলভাবে যোগ করা হয়েছে।" });
      resetForm();
    },
    onError: (error: Error) => {
      console.error("Notice creation error:", error);
      toast({
        title: "ত্রুটি!",
        description: error.message || "নোটিশ যোগ করতে ব্যর্থ হয়েছে।",
        variant: "destructive"
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const result = await withTimeout(
        supabase.from("notices").update(data).eq("id", id),
        30000,
        "আপডেট করতে সময় বেশি লাগছে।"
      );
      if ((result as any).error) throw (result as any).error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notices.admin });
      queryClient.invalidateQueries({ queryKey: ["home-notices"] });
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      toast({ title: "সফল!", description: "নোটিশ আপডেট করা হয়েছে।" });
      resetForm();
    },
    onError: () => {
      toast({ title: "ত্রুটি!", description: "নোটিশ আপডেট করতে ব্যর্থ হয়েছে।", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("notices").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notices.admin });
      queryClient.invalidateQueries({ queryKey: ["home-notices"] });
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      toast({ title: "সফল!", description: "নোটিশ মুছে ফেলা হয়েছে।" });
    },
    onError: () => {
      toast({ title: "ত্রুটি!", description: "নোটিশ মুছতে ব্যর্থ হয়েছে।", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({ title: "", content: "", category: "সাধারণ", is_new: true });
    setEditingNotice(null);
    setDialogOpen(false);
  };

  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      category: notice.category,
      is_new: notice.is_new,
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNotice) {
      updateMutation.mutate({ id: editingNotice.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <AdminLayout title="নোটিশ ব্যবস্থাপনা">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">সকল নোটিশ পরিচালনা করুন</p>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                নতুন নোটিশ
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingNotice ? "নোটিশ সম্পাদনা" : "নতুন নোটিশ যোগ করুন"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">শিরোনাম</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">বিস্তারিত</Label>
                  <Textarea
                    id="content"
                    rows={4}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">ক্যাটাগরি</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingNotice ? "আপডেট করুন" : "যোগ করুন"}
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
        ) : notices?.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">কোনো নোটিশ নেই</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notices?.map((notice) => (
              <Card key={notice.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{notice.title}</CardTitle>
                        {notice.is_new && (
                          <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                            নতুন
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline">{notice.category}</Badge>
                        <span>•</span>
                        <span>{format(new Date(notice.created_at), "dd/MM/yyyy")}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" onClick={() => handleEdit(notice)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => deleteMutation.mutate(notice.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{notice.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
