import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Clock, AlertCircle, Info } from "lucide-react";

export function AdmissionDetails() {
    const fees = [
        {
            title: "ভর্তি ফরম",
            amount: "১০০ টাকা",
            icon: <FileText className="h-5 w-5" />
        },
        {
            title: "ভর্তি ফি (৩টি বিষয়ের জন্য)",
            amount: "৯০০০ - ১২০০০ টাকা",
            icon: <span className="text-xl font-bold leading-none">৳</span>,
            note: "বিষয়ের সংখ্যা অনুযায়ী পরিবর্তনশীল"
        },
        {
            title: "প্রতি বিষয়ে ভর্তি ফি",
            amount: "৩০০০ - ৪০০০ টাকা",
            icon: <Info className="h-5 w-5" />,
            note: "শাখা অনুযায়ী প্রযোজ্য"
        },
        {
            title: "মাসিক বেতন (প্রতি বিষয়)",
            amount: "১০০০ - ১৫০০ টাকা",
            icon: <Calendar className="h-5 w-5" />,
            note: "শাখা অনুযায়ী প্রযোজ্য"
        },
        {
            title: "সেশন ফি (বার্ষিক)",
            amount: "৬০০০ টাকা",
            icon: <Clock className="h-5 w-5" />,
            note: "ভর্তির সময় প্রযোজ্য নয়, পরবর্তী বৎসরে ২০০০-৩০০০ টাকা হারে ৩ কিস্তিতে"
        },
        {
            title: "পরীক্ষার ফি (প্রতি বিষয়)",
            amount: "৫০০ টাকা",
            icon: <AlertCircle className="h-5 w-5" />
        }
    ];

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Ornaments */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -ml-32 -mb-32" />

            <div className="container relative">
                <div className="flex flex-col lg:flex-row gap-12 items-center">
                    <div className="lg:w-1/3 space-y-6">
                        <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 py-1 px-4">
                            ভর্তি সংক্রান্ত তথ্য
                        </Badge>
                        <h2 className="text-4xl font-bold leading-tight">
                            শিল্পের পথে আপনার <span className="text-primary italic">প্রথম ধাপ</span>
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            সঠিক পরিকল্পনা এবং স্বচ্ছ ফি কাঠামোর মাধ্যমে আমরা নিশ্চিত করছি সবার জন্য মানসম্মত সংস্কৃতি শিক্ষা। বিস্তারিত তথ্য নিচে দেওয়া হলো।
                        </p>

                        <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200/50 space-y-3">
                            <div className="flex items-center gap-2 text-amber-700 font-bold">
                                <AlertCircle className="h-5 w-5" />
                                <span>বিশেষ শর্তাবলী</span>
                            </div>
                            <p className="text-sm text-amber-800/80 leading-relaxed">
                                অর্ধ-বার্ষিক ও বার্ষিক পরীক্ষার পূর্বে একসাথে ২ মাসের বেতন এবং পরীক্ষার ফি পরিশোধ করা আবশ্যক।
                            </p>
                        </div>
                    </div>

                    <div className="lg:w-2/3 grid sm:grid-cols-2 gap-4">
                        {fees.map((fee, index) => (
                            <Card key={index} className="border-none shadow-sm bg-muted/30 hover:bg-white hover:shadow-md transition-all group">
                                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                                        {fee.icon}
                                    </div>
                                    <div>
                                        <CardTitle className="text-sm font-semibold">{fee.title}</CardTitle>
                                        <p className="text-xl font-bold text-primary mt-1">{fee.amount}</p>
                                    </div>
                                </CardHeader>
                                {fee.note && (
                                    <CardContent>
                                        <p className="text-[11px] text-muted-foreground bg-white/50 px-2 py-1 rounded w-fit italic">
                                            * {fee.note}
                                        </p>
                                    </CardContent>
                                )}
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
