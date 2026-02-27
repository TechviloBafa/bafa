import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/client";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Camera, X, Loader2, Video, Play, ExternalLink, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const photoCategories = ["সব", "অনুষ্ঠান", "সংগীত", "চিত্রকলা", "নৃত্য", "নাটক", "ক্যাম্প"];

interface GalleryImage {
  id: string;
  title: string;
  category: string;
  image_url: string;
  created_at: string;
}

interface VideoItem {
  id: string;
  title: string;
  youtube_url: string;
  created_at: string;
}

export default function Gallery() {
  const [activePhotoCategory, setActivePhotoCategory] = useState("সব");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  // Fetch Photos
  // ... (keeping existing query logic)
  const { data: images = [], isLoading: isPhotosLoading } = useQuery({
    queryKey: ["gallery-images"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery" as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as any) as GalleryImage[];
    },
    staleTime: 1000 * 60 * 5,
  });

  // Fetch Videos
  const { data: videos = [], isLoading: isVideosLoading } = useQuery({
    queryKey: ["video-gallery-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("video_gallery" as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as any) as VideoItem[];
    },
    staleTime: 1000 * 60 * 5,
  });

  const filteredImages =
    activePhotoCategory === "সব"
      ? images
      : images.filter((img) => img.category === activePhotoCategory);

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <Layout>
      <div className="pt-32 pb-24 bg-muted/30 min-h-screen">
        <div className="container">
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 py-1 px-4 mb-4">
              গ্যালারি
            </Badge>
            <h1 className="text-5xl font-bold tracking-tight mb-6">
              স্মৃতিতে <span className="text-primary italic">বাফা</span>
            </h1>
            <p className="text-muted-foreground text-xl leading-relaxed">
              আমাদের বিভিন্ন অনুষ্ঠান, কার্যক্রম এবং সাফল্যের মুহূর্তগুলো এখানে তুলে ধরা হয়েছে।
            </p>
          </div>

          <Tabs defaultValue="photos" className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="bg-white p-1 rounded-2xl h-auto shadow-sm ring-1 ring-border/50">
                <TabsTrigger
                  value="photos"
                  className="rounded-xl px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2"
                >
                  <ImageIcon className="h-4 w-4" />
                  ফটো গ্যালারি
                </TabsTrigger>
                <TabsTrigger
                  value="videos"
                  className="rounded-xl px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2"
                >
                  <Video className="h-4 w-4" />
                  ভিডিও গ্যালারি
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="photos" className="space-y-8 animate-in fade-in duration-500">
              {/* Photo Categories */}
              <div className="flex flex-wrap justify-center gap-2">
                {photoCategories.map((category) => (
                  <Button
                    key={category}
                    variant={activePhotoCategory === category ? "default" : "outline"}
                    className="rounded-full px-6"
                    size="sm"
                    onClick={() => setActivePhotoCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {isPhotosLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              ) : filteredImages.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-muted">
                  <Camera className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">কোন ছবি পাওয়া যায়নি</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredImages.map((image) => (
                    <div
                      key={image.id}
                      className="group cursor-pointer bg-white p-4 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all ring-1 ring-border/50"
                      onClick={() => setSelectedImage(image)}
                    >
                      <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-muted">
                        <img
                          src={image.image_url}
                          alt={image.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-6 left-6 right-6 text-white">
                            <p className="font-bold text-lg">{image.title}</p>
                            <Badge variant="outline" className="text-white border-white/30 text-[10px] mt-2">
                              {image.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="videos" className="space-y-8 animate-in fade-in duration-500">
              {isVideosLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              ) : videos.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-muted">
                  <Video className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">কোন ভিডিও পাওয়া যায়নি</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {videos.map((video) => {
                    const videoId = getYoutubeId(video.youtube_url);
                    return (
                      <div
                        key={video.id}
                        className="bg-white rounded-[2.5rem] p-4 shadow-sm hover:shadow-xl transition-all group ring-1 ring-border/50 cursor-pointer"
                        onClick={() => setSelectedVideo(video)}
                      >
                        <div className="aspect-video rounded-[2rem] overflow-hidden bg-muted relative">
                          {videoId ? (
                            <>
                              <img
                                src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                                alt={video.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-3xl">
                                  <Play className="h-6 w-6 fill-current" />
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Video className="h-10 w-10 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="p-4 pt-6">
                          <h3 className="text-lg font-bold line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors">
                            {video.title}
                          </h3>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Lightbox for Images */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none sm:rounded-3xl">
          <DialogTitle className="sr-only">
            {selectedImage?.title || "Gallery Image"}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 text-white bg-black/20 backdrop-blur-md hover:bg-black/40 rounded-full h-10 w-10"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-6 w-6" />
          </Button>
          {selectedImage && (
            <div className="relative group overflow-hidden rounded-3xl">
              <img
                src={selectedImage.image_url}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[85vh] object-contain bg-black/10"
              />
              <div className="p-8 bg-white/95 backdrop-blur-sm border-t border-border">
                <div className="flex flex-col gap-2">
                  <Badge variant="secondary" className="w-fit text-primary bg-primary/10 border-none">
                    {selectedImage.category}
                  </Badge>
                  <h3 className="text-2xl font-bold">{selectedImage.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    আপলোড করা হয়েছে: {new Date(selectedImage.created_at).toLocaleDateString('bn-BD')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Lightbox for Videos */}
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
    </Layout>
  );
}
