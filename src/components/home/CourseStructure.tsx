import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Award, GraduationCap, Music, Palette, Play } from "lucide-react";

export function CourseStructure() {
    const levels = [
        {
            title: "ফাউন্ডেশন কোর্স",
            duration: "২ বছর মেয়াদী",
            icon: <BookOpen className="h-6 w-6 text-primary" />,
            description: "৪-১০ বছর বয়সের শিশু (প্লে, নার্সারী, কেজি, প্রথম এবং দ্বিতীয় শ্রেণীতে পাঠ্যরত) ছাত্র-ছাত্রীদের জন্য।",
            next: "ফাউন্ডেশন কোর্স সমাপ্তির পর শিশু সার্টিফিকেট কোর্সের প্রথম বর্ষে ভর্তি হতে পারবে।"
        },
        {
            title: "শিশু সার্টিফিকেট কোর্স",
            duration: "৪ বছর মেয়াদী",
            icon: <Award className="h-6 w-6 text-secondary" />,
            description: "৩য় শ্রেণী থেকে ৭ম শ্রেণী পর্যন্ত পাঠ্যরত শিক্ষার্থীদের জন্য।",
            next: "শিশু কোর্স সম্পন্ন করার পর সিনিয়র সার্টিফিকেট কোর্সে সরাসরি ভর্তি হতে পারবে।"
        },
        {
            title: "সার্টিফিকেট কোর্স",
            duration: "৪ বছর মেয়াদী",
            icon: <GraduationCap className="h-6 w-6 text-primary" />,
            description: "৮ম থেকে স্নাতকোত্তর শ্রেণীর শিক্ষার্থীদের জন্য।"
        }
    ];

    const departments = [
        { name: "কণ্ঠ সঙ্গীত", icon: <Music className="h-4 w-4" /> },
        { name: "নৃত্যকলা", icon: <Play className="h-4 w-4" /> },
        { name: "চিত্রাঙ্কন", icon: <Palette className="h-4 w-4" /> },
        { name: "স্প্যানীশ গীটার", icon: <Music className="h-4 w-4" /> },
        { name: "আবৃত্তি", icon: <BookOpen className="h-4 w-4" /> },
        { name: "উপস্থাপনা", icon: <Award className="h-4 w-4" /> },
        { name: "তবলা", icon: <Music className="h-4 w-4" /> },
        { name: "কারাতে", icon: <Award className="h-4 w-4" /> }
    ];

    return (
        <section className="py-20 bg-muted/30">
            <div className="container">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">আমাদের কোর্স সমূহ</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        শিল্প ও সংস্কৃতি শিক্ষার ধাপে ধাপে প্রসারে আমাদের বিভিন্ন মেয়াদী কোর্সসমূহ
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {levels.map((level, index) => (
                        <Card key={index} className="relative overflow-hidden hover:shadow-xl transition-all border-primary/10">
                            <CardHeader className="text-center pb-2">
                                <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                    {level.icon}
                                </div>
                                <CardTitle className="text-xl mb-1">{level.title}</CardTitle>
                                <Badge variant="secondary" className="w-fit mx-auto">{level.duration}</Badge>
                            </CardHeader>
                            <CardContent className="text-center space-y-4">
                                <p className="text-muted-foreground text-sm">
                                    {level.description}
                                </p>
                                {level.next && (
                                    <p className="text-xs font-medium text-primary bg-primary/5 p-3 rounded-lg border border-primary/10">
                                        💡 {level.next}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold flex items-center gap-2">
                            <div className="h-8 w-2 bg-primary rounded-full" />
                            বিভাগ সমূহ
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {departments.map((dept, index) => (
                                <div key={index} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white border border-primary/5 hover:border-primary/20 hover:shadow-md transition-all group">
                                    <div className="text-primary group-hover:scale-110 transition-transform">
                                        {dept.icon}
                                    </div>
                                    <span className="text-sm font-medium">{dept.name}</span>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-primary/10 space-y-4 shadow-sm">
                            <h4 className="font-bold flex items-center gap-2 text-primary">
                                <Play className="h-4 w-4" /> নৃত্যকলা বিশেষত্ব
                            </h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                সাধারণ নৃত্য ও উচ্চাঙ্গ নৃত্য (কথক/ভরত নাট্যম) সকলের জন্য আবশ্যক।
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-2xl border border-secondary/20 shadow-sm space-y-6">
                            <h3 className="text-2xl font-bold flex items-center gap-2">
                                <Palette className="h-6 w-6 text-secondary" />
                                চারুকলা ও যন্ত্র সঙ্গীত
                            </h3>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <p className="font-bold text-sm text-secondary uppercase tracking-wider">চারুকলা বিভাগ</p>
                                    <p className="text-muted-foreground text-sm">
                                        চিত্রাঙ্কন, জল রং, প্যাস্টেল রং, রেখা চিত্র, তৈল চিত্র, মঞ্চ সজ্জা ইত্যাদি।
                                    </p>
                                </div>

                                <div className="pt-4 space-y-2 border-t border-muted">
                                    <p className="font-bold text-sm text-secondary uppercase tracking-wider">যন্ত্র সঙ্গীত বিভাগ</p>
                                    <p className="text-muted-foreground text-sm">
                                        স্প্যানীশ গীটার, তবলা, বেহালা।
                                    </p>
                                </div>
                            </div>

                            <div className="bg-secondary/5 p-4 rounded-xl border border-secondary/10">
                                <p className="text-xs italic text-black font-medium">
                                    * বিশেষ দ্রষ্টব্য: পূর্বে অভিজ্ঞ এমন কোন আবেদনকারী বিষয় ভিত্তিক শিক্ষকদের অনুমতিক্রমে সার্টিফিকেট কোর্সের যে কোন বর্ষে ভর্তি হতে পারবে।
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
