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
import { Plus, Pencil, Trash2, Building2, Search } from "lucide-react";
import { supabase } from "@/integrations/client";
import { toast } from "sonner";
import { withTimeout } from "@/utils/promiseUtils";

interface Branch {
  id: string;
  branch_name: string;
  address: string;
  phone: string;
  email: string | null;
  established: string | null;
  students: number | null;
  teachers: number | null;
  image_url: string | null;
  description: string | null;
  facilities: string[] | null;
  class_time: string | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
}

interface BranchFormData {
  branch_name: string;
  address: string;
  phone: string;
  email: string;
  established: string;
  students: number;
  teachers: number;
  image_url: string;
  description: string;
  facilities: string;
  class_time: string;
  is_active: boolean;
}

const initialFormData: BranchFormData = {
  branch_name: "",
  address: "",
  phone: "",
  email: "",
  established: "",
  students: 0,
  teachers: 0,
  image_url: "",
  description: "",
  facilities: "",
  class_time: "",
  is_active: true,
};

export default function AdminBranches() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);
  const [formData, setFormData] = useState<BranchFormData>(initialFormData);

  const queryClient = useQueryClient();

  const { data: branches, isLoading } = useQuery({
    queryKey: ["admin-branches"],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from("branches" as any) // eslint-disable-line @typescript-eslint/no-explicit-any
        .select("*")
        .order("created_at", { ascending: false }));
      if (error) throw error;
      return (data as any) as Branch[];
    },
    staleTime: 1000 * 30, // 30 seconds
  });

  const createMutation = useMutation({
    mutationFn: async (data: BranchFormData) => {
      console.log("AdminBranches: Attempting to create branch with data:", data);

      // Pre-verify session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.warn("AdminBranches: No active session found during create.");
        throw new Error("আপনার সেশন পাওয়া যাচ্ছে না। দয়া করে আবার লগইন করুন।");
      }

      const payload = {
        branch_name: data.branch_name,
        address: data.address,
        phone: data.phone,
        email: data.email || null,
        established: data.established || null,
        students: data.students,
        teachers: data.teachers,
        image_url: data.image_url || null,
        description: data.description || null,
        facilities: data.facilities ? data.facilities.split(",").map(f => f.trim()).filter(Boolean) : [],
        class_time: data.class_time || null,
        is_active: data.is_active,
      };

      console.log("AdminBranches: Sending payload to Supabase:", payload);

      const result = await withTimeout(
        supabase.from("branches" as any).insert([payload]),
        60000,
        "শাখা যোগ করতে সময় বেশি লাগছে। আপনার ইন্টারনেট সংযোগ চেক করুন এবং পুনরায় চেষ্টা করুন।"
      );

      if (result.error) {
        console.error("AdminBranches: Supabase error details:", result.error);
        throw result.error;
      }

      console.log("AdminBranches: Create successful");
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-branches"] });
      toast.success("শাখা সফলভাবে যোগ করা হয়েছে");
      handleCloseDialog();
    },
    onError: (error: any) => {
      console.error("AdminBranches: Create error:", error);
      toast.error(`শাখা যোগ করতে সমস্যা হয়েছে: ${error.message || "Unknown error"}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BranchFormData }) => {
      console.log("AdminBranches: Attempting to update branch:", id, data);

      const payload = {
        branch_name: data.branch_name,
        address: data.address,
        phone: data.phone,
        email: data.email || null,
        established: data.established || null,
        students: data.students,
        teachers: data.teachers,
        image_url: data.image_url || null,
        description: data.description || null,
        facilities: data.facilities ? data.facilities.split(",").map(f => f.trim()).filter(Boolean) : [],
        class_time: data.class_time || null,
        is_active: data.is_active,
      };

      const result = await withTimeout(
        supabase
          .from("branches" as any) // eslint-disable-line @typescript-eslint/no-explicit-any
          .update(payload)
          .eq("id", id),
        60000,
        "শাখা আপডেট করতে সময় বেশি লাগছে। পুনরায় চেষ্টা করুন।"
      );

      if (result.error) {
        console.error("AdminBranches: Update Supabase error:", result.error);
        throw result.error;
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-branches"] });
      toast.success("শাখা সফলভাবে আপডেট করা হয়েছে");
      handleCloseDialog();
    },
    onError: (error: any) => {
      console.error("AdminBranches: Update error:", error);
      toast.error(`শাখা আপডেট করতে সমস্যা হয়েছে: ${error.message || "Unknown error"}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await withTimeout(
        supabase.from("branches" as any).delete().eq("id", id),
        30000,
        "মুছে ফেলতে সময় বেশি লাগছে।"
      );
      if (result.error) throw result.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-branches"] });
      toast.success("শাখা সফলভাবে মুছে ফেলা হয়েছে");
      setIsDeleteAlertOpen(false);
      setBranchToDelete(null);
    },
    onError: (error: any) => {
      console.error("AdminBranches: Delete error:", error);
      toast.error(`শাখা মুছে ফেলতে সমস্যা হয়েছে: ${error.message || "Unknown error"}`);
    },
  });

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingBranch(null);
    setFormData(initialFormData);
  };

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setFormData({
      branch_name: branch.branch_name || "",
      address: branch.address,
      phone: branch.phone,
      email: branch.email || "",
      established: branch.established || "",
      students: branch.students || 0,
      teachers: branch.teachers || 0,
      image_url: branch.image_url || "",
      description: branch.description || "",
      facilities: branch.facilities?.join(", ") || "",
      class_time: branch.class_time || "",
      is_active: branch.is_active ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBranch) {
      updateMutation.mutate({ id: editingBranch.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const filteredBranches = branches?.filter(
    (branch) =>
      (branch.branch_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (branch.address?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="শাখা ব্যবস্থাপনা">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="শাখা খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            নতুন শাখা যোগ করুন
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border rounded-lg p-4 text-center">
            <Building2 className="h-6 w-6 mx-auto text-primary mb-2" />
            <div className="text-2xl font-bold">{branches?.length || 0}</div>
            <div className="text-sm text-muted-foreground">মোট শাখা</div>
          </div>
          <div className="bg-card border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {branches?.filter(b => b.is_active).length || 0}
            </div>
            <div className="text-sm text-muted-foreground">সক্রিয় শাখা</div>
          </div>
          <div className="bg-card border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {branches?.reduce((acc, b) => acc + (b.students || 0), 0) || 0}
            </div>
            <div className="text-sm text-muted-foreground">মোট শিক্ষার্থী</div>
          </div>
          <div className="bg-card border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {branches?.reduce((acc, b) => acc + (b.teachers || 0), 0) || 0}
            </div>
            <div className="text-sm text-muted-foreground">মোট শিক্ষক</div>
          </div>
        </div>

        {/* Table */}
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
                  <TableHead>শাখার নাম</TableHead>
                  <TableHead className="hidden md:table-cell">ঠিকানা</TableHead>
                  <TableHead className="hidden sm:table-cell">ফোন</TableHead>
                  <TableHead className="hidden lg:table-cell">শিক্ষার্থী</TableHead>
                  <TableHead>স্ট্যাটাস</TableHead>
                  <TableHead className="text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBranches?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      কোনো শাখা পাওয়া যায়নি
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBranches?.map((branch) => (
                    <TableRow key={branch.id}>
                      <TableCell className="font-medium text-primary">
                        {branch.branch_name}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{branch.address}</TableCell>
                      <TableCell className="hidden sm:table-cell">{branch.phone}</TableCell>
                      <TableCell className="hidden lg:table-cell">{branch.students || 0}</TableCell>
                      <TableCell>
                        <Badge variant={branch.is_active ? "default" : "secondary"}>
                          {branch.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(branch)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => {
                              setBranchToDelete(branch);
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

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBranch ? "শাখা সম্পাদনা করুন" : "নতুন শাখা যোগ করুন"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">শাখার নাম *</Label>
                <Input
                  id="name"
                  value={formData.branch_name}
                  onChange={(e) => setFormData({ ...formData, branch_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">ফোন নম্বর *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">ঠিকানা *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">ইমেইল</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="established">প্রতিষ্ঠিত সাল</Label>
                <Input
                  id="established"
                  value={formData.established}
                  onChange={(e) => setFormData({ ...formData, established: e.target.value })}
                  placeholder="যেমন: 2000"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="students">শিক্ষার্থী সংখ্যা</Label>
                <Input
                  id="students"
                  type="number"
                  value={formData.students}
                  onChange={(e) => setFormData({ ...formData, students: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teachers">শিক্ষক সংখ্যা</Label>
                <Input
                  id="teachers"
                  type="number"
                  value={formData.teachers}
                  onChange={(e) => setFormData({ ...formData, teachers: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">ছবির URL</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">বিবরণ</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facilities">সুযোগ-সুবিধা (কমা দিয়ে আলাদা করুন)</Label>
              <Input
                id="facilities"
                value={formData.facilities}
                onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                placeholder="সংগীত রুম, নৃত্য হল, লাইব্রেরি"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="class_time">ক্লাস টাইম (যেমন: শুক্র ও শনি: বিকাল ৩টা - সন্ধ্যা ৬টা)</Label>
              <Input
                id="class_time"
                value={formData.class_time}
                onChange={(e) => setFormData({ ...formData, class_time: e.target.value })}
                placeholder="ক্লাস টাইম লিখুন..."
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">সক্রিয় শাখা</Label>
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
                  : editingBranch
                    ? "আপডেট করুন"
                    : "যোগ করুন"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>শাখা মুছে ফেলতে চান?</AlertDialogTitle>
            <AlertDialogDescription>
              আপনি কি নিশ্চিত যে আপনি "{branchToDelete?.branch_name}" শাখাটি মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => branchToDelete && deleteMutation.mutate(branchToDelete.id)}
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
