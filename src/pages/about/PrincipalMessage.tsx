import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

export default function PrincipalMessage() {
  return (
    <Layout>
      {/* Header */}
      <section className="hero-gradient py-16">
        <div className="container text-center text-primary-foreground">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">অধ্যক্ষের বাণী</h1>
          <p className="text-lg text-white/80">মোঃ শাহ আলম রিয়াদ, অধ্যক্ষ</p>
        </div>
      </section>

      {/* Message Content */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {/* Photo */}
            <div className="md:col-span-1">
              <div className="aspect-[3/4] rounded-2xl bg-muted overflow-hidden shadow-lg border-4 border-white">
                <img
                  src="/principal.jpeg"
                  alt="Principal"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center mt-4">
                <h3 className="font-bold text-lg">মোঃ শাহ আলম রিয়াদ</h3>
                <p className="text-muted-foreground">অধ্যক্ষ</p>
              </div>
            </div>

            {/* Message */}
            <div className="md:col-span-2 space-y-6">
              <div className="flex items-start gap-3">
                <Quote className="h-10 w-10 text-primary shrink-0" />
                <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
                  <p>
                    প্রিয় শিক্ষার্থী, অভিভাবক ও শুভানুধ্যায়ীবৃন্দ,
                  </p>
                  <p>
                    শিশুরাই আগামী দিনের ভবিষ্যৎ, আমাদের আজকের শিশুরাই আগামী দিনের শিল্প ও সংস্কৃতির ধারক ও বাহক। ক্রমবর্ধমান আকাশ সংস্কৃতির আগ্রাসন থেকে আমাদের সন্তানদের বাঁচাতে এবং শিক্ষার সঙ্গে সংস্কৃতির সম্পৃক্তি নিশ্চিত করে পূর্ণ মানব গড়ে তোলার লক্ষ্যে সংস্কৃতি শিক্ষার বিকাশ ঘটানো আমাদের লক্ষ্য। 
                  </p>
                  <p>
                    বাংলাদেশ বুলবুল ললিতকলা একাডেমী বাফার শিক্ষক মন্ডলী যারা রয়েছেন তাদের পরিচিতি যশ, খ্যাতি সাংস্কৃতিক পরিমন্ডলে কারো অজানা নয়। বাংলাদেশের ইতিহাস ঐতিহ্য ও আপন সংস্কৃতি শিক্ষা প্রসারে এবং অপ-সংস্কৃতির হাত থেকে আমাদের শিশু ও যুবকদের রক্ষা করে দেশীয় সংস্কৃতি প্রতিষ্ঠা করাই আমাদের উদ্দেশ্য।
                  </p>
                 
                </div>
              </div>

              <Card className="bg-muted/50">
                <CardContent className="p-6">
                  <p className="font-semibold text-lg">মোঃ রিয়াদ</p>
                  <p className="text-muted-foreground">অধ্যক্ষ, বুলবুল ললিতকলা একাডেমী</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
