import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

export default function ChairmanMessage() {
  return (
    <Layout>
      {/* Header */}
      <section className="hero-gradient py-16">
        <div className="container text-center text-primary-foreground">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">সভাপতির বাণী</h1>
          <p className="text-lg text-white/80">জনাব আব্দুল করিম, সভাপতি</p>
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
                  src="#"
                  alt="Chairman"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center mt-4">
                <h3 className="font-bold text-lg">#</h3>
                <p className="text-muted-foreground">সভাপতি</p>
              </div>
            </div>

            {/* Message */}
            <div className="md:col-span-2 space-y-6">
              <div className="flex items-start gap-3">
                <Quote className="h-10 w-10 text-primary shrink-0" />
                <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
                  <p>
                    সম্মানিত অভিভাবক, শিক্ষার্থী ও শুভাকাঙ্ক্ষীবৃন্দ,
                  </p>
                  <p>
                    বুলবুল ললিতকলা একাডেমীর পক্ষ থেকে আপনাদের সকলকে আন্তরিক শুভেচ্ছা।
                    আমাদের এই প্রতিষ্ঠানটি বাংলাদেশের সমৃদ্ধ সাংস্কৃতিক ঐতিহ্যকে ধারণ করে
                    নতুন প্রজন্মের কাছে পৌঁছে দেওয়ার অঙ্গীকার নিয়ে কাজ করে যাচ্ছে।
                  </p>
                  <p>
                    শিল্প-সংস্কৃতি একটি জাতির পরিচয়ের মূল ভিত্তি। সংগীত, নৃত্য, চিত্রকলা ও
                    নাট্যকলার মাধ্যমে আমরা আমাদের ঐতিহ্যকে সংরক্ষণ করতে পারি এবং ভবিষ্যৎ
                    প্রজন্মের কাছে তুলে ধরতে পারি।
                  </p>
                  <p>
                    আমাদের একাডেমী শুধু শিল্পকলা শেখায় না, বরং একটি সুন্দর মানসিকতা ও
                    জীবনবোধ গড়ে তুলতে সাহায্য করে। আমরা চাই প্রতিটি শিক্ষার্থী তার
                    সম্ভাবনার পূর্ণ বিকাশ ঘটাক।
                  </p>
                  <p>
                    আমি বিশ্বাস করি, আপনাদের সহযোগিতায় আমরা বাংলার শিল্প-সংস্কৃতিকে
                    আরও সমৃদ্ধ করতে পারব। সকলের প্রতি আন্তরিক কৃতজ্ঞতা ও শুভকামনা।
                  </p>
                </div>
              </div>

              <Card className="bg-muted/50">
                <CardContent className="p-6">
                  <p className="font-semibold text-lg">জনাব আব্দুল করিম</p>
                  <p className="text-muted-foreground">সভাপতি, বুলবুল ললিতকলা একাডেমী</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
