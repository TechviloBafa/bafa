import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Video, ExternalLink, Play, ArrowRight, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface VideoItem {
    id: string;
    title: string;
    youtube_url: string;
}

export function VideoGallerySection() {
    const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
    const { data: videos, isLoading } = useQuery({
        queryKey: ["homepage_videos"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("video_gallery" as any)
                .select("*")
                .order("created_at", { ascending: false })
                .limit(6);
            if (error) throw error;
            return (data as any) as VideoItem[];
        },
    });

    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    return (
        <section className="py-24 bg-background">
            <div className="container">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="space-y-4">
                        <Badge variant="outline" className="text-secondary border-secondary/20 bg-secondary/5 font-semibold py-1 px-4">
                            ভিডিও গ্যালরি
                        </Badge>
                        <h2 className="text-4xl font-bold tracking-tight">
                            একাডেমির <span className="text-secondary italic">কার্যক্রমের ভিডিও</span>
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl">
                            বাফার বিভিন্ন সাংস্কৃতিক অনুষ্ঠান, কর্মশালা এবং বিভিন্ন উৎসবের ভিডিও চিত্র দেখুন।
                        </p>
                    </div>
                    <Button asChild className="hidden md:flex bg-secondary hover:bg-secondary/90 transition-transform hover:scale-105 group">
                        <Link to="/gallery" className="gap-2">
                            আরও দেখুন
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-secondary" />
                    </div>
                ) : videos && videos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {videos.map((video) => {
                            const videoId = getYoutubeId(video.youtube_url);
                            return (
                                <div key={video.id} className="group relative">
                                    <div
                                        className="aspect-video rounded-3xl overflow-hidden bg-muted shadow-lg shadow-black/5 ring-1 ring-border relative cursor-pointer"
                                        onClick={() => setSelectedVideo(video)}
                                    >
                                        {videoId ? (
                                            <div className="w-full h-full">
                                                <img
                                                    src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                                                    alt={video.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    onError={(e) => {
                                                        // Fallback if maxres is missing
                                                        (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                                                    <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                                                        <Play className="h-8 w-8 fill-current" />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Video className="h-12 w-12 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-6">
                                        <h3 className="text-xl font-bold group-hover:text-secondary transition-colors line-clamp-2">
                                            {video.title}
                                        </h3>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-muted/20 rounded-3xl">
                        <Video className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground">এখনো কোনো ভিডিও পাওয়া যায়নি।</p>
                    </div>
                )}

                <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
                    <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-none shadow-2xl sm:rounded-3xl aspect-video">
                        <DialogTitle className="sr-only">
                            {selectedVideo?.title || "Video Player"}
                        </DialogTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 z-50 text-white bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full h-10 w-10"
                            onClick={() => setSelectedVideo(null)}
                        >
                            <X className="h-6 w-6" />
                        </Button>
                        {selectedVideo && (
                            <iframe
                                src={`https://www.youtube.com/embed/${getYoutubeId(selectedVideo.youtube_url)}?autoplay=1`}
                                title={selectedVideo.title}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        )}
                    </DialogContent>
                </Dialog>

                <div className="mt-12 text-center md:hidden">
                    <Button asChild className="w-full bg-secondary hover:bg-secondary/90">
                        <Link to="/gallery" className="gap-2">
                            আরও দেখুন
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
