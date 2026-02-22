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
import { Plus, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { withTimeout } from "@/utils/promiseUtils";

const categories = ["অনুষ্ঠান", "সংগীত", "চিত্রকলা", "নৃত্য", "নাটক", "ক্যাম্প"];

interface GalleryImage {
  id: string;
  title: string;
  category: string;
  image_url: string;
  created_at: string;
}

export default function AdminGallery() {
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    image: null as File | null,
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: images = [], isLoading } = useQuery({
    queryKey: ["gallery-images"],
    queryFn: async () => {
      // Set timeout for the query - if it takes too long, return empty array
      const timeoutPromise = new Promise<GalleryImage[]>((_, reject) =>
        setTimeout(() => reject(new Error("Query timeout")), 5000)
      );

      const queryPromise = (async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
          .from("gallery")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        return data as GalleryImage[];
      })();

      try {
        return await Promise.race([queryPromise, timeoutPromise]);
      } catch (error) {
        console.error("Gallery query error:", error);
        // Return empty array instead of throwing to show empty state
        return [];
      }
    },
    staleTime: 1000 * 30, // 30 seconds
  });

  const uploadMutation = useMutation({
    mutationFn: async (formValues: typeof formData) => {
      if (!formValues.image || !formValues.title || !formValues.category) {
        throw new Error("সব ফিল্ড পূরণ করুন");
      }

      setUploading(true);
      try {
        // Upload image to storage
        const fileName = `${Date.now()}-${formValues.image.name}`;
        const { error: uploadError, data } = await supabase.storage
          .from("gallery-images")
          .upload(fileName, formValues.image);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from("gallery-images")
          .getPublicUrl(fileName);

        // Insert into database
        const { error: dbError } = await withTimeout(
          (supabase.from("gallery") as any)
            .insert({
              title: formValues.title,
              category: formValues.category,
              image_url: publicUrl,
            }),
          12000,
          "ডাটাবেসে ছবি সংরক্ষণ করতে সময় বেশি লাগছে।"
        );

        if (dbError) throw dbError;

        return data;
      } finally {
        setUploading(false);
      }
    },
    onSuccess: () => {
      toast({
        title: "সফল",
        description: "ছবি সফলভাবে আপলোড হয়েছে",
      });
      setOpenDialog(false);
      setFormData({ title: "", category: "", image: null });
      queryClient.invalidateQueries({ queryKey: ["gallery-images"] });
    },
    onError: (error: Error) => {
      toast({
        title: "ত্রুটি",
        description: error.message || "ছবি আপলোড করতে ব্যর্থ",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const image = images.find((img) => img.id === id);
      if (!image) throw new Error("ছবি খুঁজে পাওয়া যায়নি");

      // Extract filename from URL
      const fileName = image.image_url.split("/").pop();
      if (fileName) {
        await supabase.storage.from("gallery-images").remove([fileName]);
      }

      // Delete from database
      const { error } = await withTimeout(
        supabase.from("gallery" as any).delete().eq("id", id),
        12000,
        "ডাটাবেস থেকে মুছতে সময় বেশি লাগছে।"
      );
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "সফল",
        description: "ছবি সফলভাবে মুছে ফেলা হয়েছে",
      });
      setDeleteId(null);
      queryClient.invalidateQueries({ queryKey: ["gallery-images"] });
    },
    onError: (error: Error) => {
      toast({
        title: "ত্রুটি",
        description: error.message || "ছবি মুছতে ব্যর্থ",
        variant: "destructive",
      });
    },
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const handleUpload = async () => {
    await uploadMutation.mutateAsync(formData);
  };

  return (
    <AdminLayout title="গ্যালারি ব্যবস্থাপনা">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">গ্যালারি</h1>
            <p className="text-muted-foreground mt-1">
              মোট ছবি: {images.length}
            </p>
          </div>
          <Button onClick={() => setOpenDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            নতুন ছবি যোগ করুন
          </Button>
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : images.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">কোন ছবি নেই</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="h-full w-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold truncate">{image.title}</h3>
                  <p className="text-sm text-muted-foreground">{image.category}</p>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                      onClick={() => setDeleteId(image.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      মুছুন
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Upload Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>নতুন ছবি যোগ করুন</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">ছবির শিরোনাম</Label>
              <Input
                id="title"
                placeholder="যেমন: বার্ষিক সাংস্কৃতিক অনুষ্ঠান"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">বিভাগ</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="বিভাগ নির্বাচন করুন" />
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

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image">ছবি নির্বাচন করুন</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
              />
              {formData.image && (
                <p className="text-sm text-muted-foreground">
                  নির্বাচিত: {formData.image.name}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDialog(false)}
              disabled={uploading}
            >
              বাতিল করুন
            </Button>
            <Button
              onClick={handleUpload}
              disabled={uploading || !formData.title || !formData.category || !formData.image}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  আপলোড করছে...
                </>
              ) : (
                "আপলোড করুন"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ছবি মুছবেন?</AlertDialogTitle>
            <AlertDialogDescription>
              এই ছবিটি স্থায়ীভাবে মুছে ফেলা হবে।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল করুন</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "মুছছে..." : "মুছুন"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
