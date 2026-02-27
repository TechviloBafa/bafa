import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2, Video, ExternalLink, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface VideoItem {
    id: string;
    title: string;
    youtube_url: string;
    created_at: string;
}

export default function AdminVideos() {
    const queryClient = useQueryClient();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newVideo, setNewVideo] = useState({ title: "", youtube_url: "" });

    const { data: videos, isLoading } = useQuery({
        queryKey: ["admin_videos"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("video_gallery")
                .select("*")
                .order("created_at", { ascending: false });
            if (error) throw error;
            return data;
        },
    });

    const addMutation = useMutation({
        mutationFn: async (vars: typeof newVideo) => {
            const { error } = await supabase.from("video_gallery").insert([vars]);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin_videos"] });
            queryClient.invalidateQueries({ queryKey: ["homepage_videos"] });
            queryClient.invalidateQueries({ queryKey: ["video-gallery-items"] });
            toast.success("ভিডিও সফলভাবে যোগ করা হয়েছে");
            setIsAddOpen(false);
            setNewVideo({ title: "", youtube_url: "" });
        },
        onError: (error) => {
            toast.error("ভিডিও যোগ করতে সমস্যা হয়েছে: " + error.message);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from("video_gallery").delete().eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin_videos"] });
            queryClient.invalidateQueries({ queryKey: ["homepage_videos"] });
            queryClient.invalidateQueries({ queryKey: ["video-gallery-items"] });
            toast.success("ভিডিও সফলভাবে মুছে ফেলা হয়েছে");
        },
        onError: (error) => {
            toast.error("ভিডিও মুছতে সমস্যা হয়েছে: " + error.message);
        },
    });

    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    return (
        <AdminLayout title="ভিডিও গ্যালারি ম্যানেজমেন্ট">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">ভিডিও সমূহ</h2>
                        <p className="text-muted-foreground text-sm">একাডেমির বিভিন্ন অনুষ্ঠানের ভিডিও ম্যানেজ করুন</p>
                    </div>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                নতুন ভিডিও যোগ করুন
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>নতুন ভিডিও যোগ করুন</DialogTitle>
                                <DialogDescription>
                                    ইউটিউব ভিডিওর টাইটেল এবং লিঙ্ক প্রদান করুন।
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">ভিডিও টাইটেল</Label>
                                    <Input
                                        id="title"
                                        placeholder="অনুষ্ঠানের নাম"
                                        value={newVideo.title}
                                        onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="url">ইউটিউব লিঙ্ক (YouTube URL)</Label>
                                    <Input
                                        id="url"
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        value={newVideo.youtube_url}
                                        onChange={(e) => setNewVideo({ ...newVideo, youtube_url: e.target.value })}
                                    />
                                </div>
                                <Button
                                    className="w-full"
                                    onClick={() => addMutation.mutate(newVideo)}
                                    disabled={addMutation.isPending || !newVideo.title || !newVideo.youtube_url}
                                >
                                    {addMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    সংরক্ষণ করুন
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {videos?.map((video) => {
                            const videoId = getYoutubeId(video.youtube_url);
                            return (
                                <Card key={video.id} className="overflow-hidden group border-muted hover:border-primary/50 transition-all">
                                    <div className="aspect-video relative bg-muted">
                                        {videoId ? (
                                            <img
                                                src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                                                alt={video.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Video className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <a
                                                href={video.youtube_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 bg-white rounded-full text-black hover:scale-110 transition-transform"
                                            >
                                                <ExternalLink className="h-5 w-5" />
                                            </a>
                                        </div>
                                    </div>
                                    <CardHeader className="p-4">
                                        <CardTitle className="text-base line-clamp-1">{video.title}</CardTitle>
                                        <CardDescription className="text-xs truncate">
                                            {video.youtube_url}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="px-4 pb-4 pt-0">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="w-full gap-2"
                                            onClick={() => {
                                                if (confirm("আপনি কি নিশ্চিতভাবে এই ভিডিওটি মুছে ফেলতে চান?")) {
                                                    deleteMutation.mutate(video.id);
                                                }
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            মুছে ফেলুন
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {!isLoading && videos?.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-muted rounded-xl">
                        <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium">কোনো ভিডিও পাওয়া যায়নি</h3>
                        <p className="text-muted-foreground">নতুন ভিডিও যোগ করতে উপরের বাটনে ক্লিক করুন</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
