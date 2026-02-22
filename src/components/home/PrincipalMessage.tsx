import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function PrincipalMessage() {
  return (
    <section className="py-16">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/5] max-w-md mx-auto lg:mx-0 rounded-2xl overflow-hidden shadow-2xl relative group">
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <img
                  src="/principal.jpeg"
                  alt="Principal"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement?.classList.remove("hidden");
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-4 p-8 bg-background/80 -z-10">
                  <div className="w-32 h-32 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-5xl">👨‍🏫</span>
                  </div>
                  <p className="text-muted-foreground">অধ্যক্ষের ছবি</p>
                </div>
              </div>
            </div>
            {/* Decorative */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-2xl -z-10" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-secondary/10 rounded-2xl -z-10" />
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-primary">
              <Quote className="h-8 w-8" />
              <span className="text-sm font-medium uppercase tracking-wider">অধ্যক্ষের বাণী</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold">
              শিল্পের মাধ্যমে জীবনকে সুন্দর করে তুলুন
            </h2>

            <Card className="border-l-4 border-l-primary bg-muted/50">
              <CardContent className="p-6">
                <p className="text-lg leading-relaxed text-muted-foreground italic">
                  "বুলবুল ললিতকলা একাডেমী শুধু একটি শিক্ষা প্রতিষ্ঠান নয়, এটি একটি সাংস্কৃতিক আন্দোলন।
                  আমরা বিশ্বাস করি যে প্রতিটি মানুষের মধ্যে সৃজনশীলতার বীজ আছে, যা সঠিক পরিচর্যায়
                  মহীরুহে পরিণত হতে পারে। আমাদের লক্ষ্য হলো শিক্ষার্থীদের মধ্যে সেই বীজকে লালন করা
                  এবং তাদের পূর্ণ সম্ভাবনায় বিকশিত করা।"
                </p>
              </CardContent>
            </Card>

            <div className="space-y-1">
              <p className="font-bold text-xl">মোঃ শাহ আলম রিয়াদ</p>
              <p className="text-muted-foreground">অধ্যক্ষ, বাংলাদেশ বুলবুল ললিতকলা একাডেমী (বাফা)</p>
            </div>

            <Link to="/about/principal-message">
              <Button variant="outline" className="mt-4">
                সম্পূর্ণ বাণী পড়ুন
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
