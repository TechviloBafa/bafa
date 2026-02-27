import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollText, CheckCircle2, AlertCircle } from "lucide-react";

export function AcademyRules() {
    const rules = [
        "কোনো শিক্ষার্থী ২টি কিংবা ৩টি বিষয়ে ভর্তি হলে তাকে সকল বিষয়ের জন্য আলাদা ভর্তি ফি ও বেতন দিতে হবে।",
        "প্রতি মাসের বেতন চলতি মাসের ১৫ তারিখের মধ্যে পরিশোধ করতে হবে। নির্দিষ্ট সময়ের মধ্যে বেতন পরিশোধ না করলে ১০০/- টাকা বিলম্ব ফি সহ দিতে হবে।",
        "পরীক্ষার সময় দুই মাসের বেতন ও পরীক্ষার ফি একত্রে নেওয়া হয়।",
        "রুটিন অনুযায়ী এবং সময়মত ক্লাসে উপস্থিত থাকতে হবে।",
        "ছাত্র-ছাত্রীগণ একাডেমীতে প্রবেশ ও থাকাকালীন সময়ে পরিচয়পত্র সাথে রাখতে হবে।",
        "কোন প্রকার অসামাজিক, অশালীন, উগ্র পোশাক পরিধান ও শিষ্টাচার বহির্ভূত আচরণ করলে তার ছাত্রাধিকার বাতিল করা হবে।",
        "প্রশিক্ষণ কোর্সে ভর্তির দুই সপ্তাহের মধ্যে নির্ধারিত ইউনিফর্ম তৈরী করতে হবে এবং নিয়মিত ইউনিফর্ম পরে ক্লাসে আসতে হবে।",
        "পিতা-মাতা ও অভিভাবকদের শ্রেণি কক্ষের ভিতরে বা নিকটে যাওয়া নিষেধ, তাদের কোন কথা/পরামর্শ/অভিযোগ থাকলে মৌখিক বা লিখিত ভাবে অধ্যক্ষ/ অফিস কর্মকর্তাকে জানাবেন।"
    ];

    return (
        <section className="py-20 bg-muted/20">
            <div className="container">
                <div className="max-w-4xl mx-auto">
                    <Card className="border-none shadow-xl bg-white overflow-hidden">
                        <CardHeader className="bg-primary text-primary-foreground p-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                    <ScrollText className="h-8 w-8" />
                                </div>
                                <div>
                                    <Badge variant="outline" className="text-white border-white/30 mb-2">প্রয়োজনীয় তথ্য</Badge>
                                    <CardTitle className="text-3xl font-bold">একাডেমির নিয়মাবলী</CardTitle>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 md:p-12">
                            <div className="grid gap-6">
                                {rules.map((rule, index) => (
                                    <div key={index} className="flex gap-4 group">
                                        <div className="mt-1">
                                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                                <span className="text-xs font-bold">{index + 1}</span>
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                                            {rule}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 p-6 rounded-2xl bg-amber-50 border border-amber-100 flex gap-4 items-start">
                                <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-bold text-amber-900 mb-1">প্রজ্ঞাপন</p>
                                    <p className="text-sm text-amber-800/80">
                                        একাডেমির সকল ছাত্র-ছাত্রী ও অভিভাবকদের উপরোক্ত নিয়মাবলী যথাযথভাবে মেনে চলার জন্য অনুরোধ করা হচ্ছে।
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
