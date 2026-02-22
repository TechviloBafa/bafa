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
                    বুলবুল ললিতকলা একাডেমীর পক্ষ থেকে আপনাদের সকলকে আন্তরিক শুভেচ্ছা ও অভিনন্দন।
                    আমাদের এই প্রতিষ্ঠানটি শিল্প ও সংস্কৃতির প্রতি গভীর ভালোবাসা ও নিষ্ঠা নিয়ে
                    গড়ে উঠেছে।
                  </p>
                  <p>
                    আমরা বিশ্বাস করি যে প্রতিটি মানুষের মধ্যে সৃজনশীলতার বীজ আছে, যা সঠিক
                    পরিচর্যায় মহীরুহে পরিণত হতে পারে। আমাদের লক্ষ্য হলো শিক্ষার্থীদের মধ্যে
                    সেই বীজকে লালন করা এবং তাদের পূর্ণ সম্ভাবনায় বিকশিত করা।
                  </p>
                  <p>
                    সংগীত, নৃত্য, চিত্রকলা ও নাট্যকলার মাধ্যমে আমরা শুধু দক্ষতা শেখাই না,
                    বরং জীবনের প্রতি একটি সুন্দর দৃষ্টিভঙ্গি গড়ে তুলতে সাহায্য করি। আমাদের
                    অভিজ্ঞ শিক্ষকমণ্ডলী প্রতিটি শিক্ষার্থীকে ব্যক্তিগত মনোযোগ দিয়ে গড়ে তোলেন।
                  </p>
                  <p>
                    আমি আশা করি, আপনারা সকলে আমাদের এই শিল্প পরিবারের সাথে যুক্ত থাকবেন এবং
                    বাংলার সমৃদ্ধ সাংস্কৃতিক ঐতিহ্যকে এগিয়ে নিয়ে যেতে সহায়তা করবেন।
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
