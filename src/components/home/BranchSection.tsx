import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Phone, Building2, ArrowRight, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/client";

interface Branch {
    id: string;
    branch_name: string;
    location_name: string | null;
    address: string;
    phone: string;
    class_time: string | null;
}

export function BranchSection() {
    const { data: branches, isLoading } = useQuery({
        queryKey: ["branches-home"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("branches" as any)
                .select("*")
                .eq("is_active", true)
                .order("branch_name")
                .limit(8);
            if (error) throw error;
            return (data as any) as Branch[];
        },
        staleTime: 1000 * 30, // 30 seconds
    });

    return (
        <section className="py-16 bg-muted/30">
            <div className="container">
                <div className="text-center mb-12 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold">আমাদের ব্রাঞ্চসমূহ</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        সারাদেশে ছড়িয়ে থাকা আমাদের উন্নত পরিবেশের শাখাসমূহ
                    </p>
                    <div className="flex justify-center pt-2">
                        <Link to="/branches">
                            <Button variant="outline" className="group">
                                সবগুলো ব্রাঞ্চ দেখুন
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <Card key={i} className="h-full">
                                <CardContent className="p-6 space-y-4">
                                    <Skeleton className="h-6 w-3/4" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-2/3" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {branches?.map((branch, index) => (
                            <motion.div
                                key={branch.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-none bg-white/50 backdrop-blur-sm shadow-sm h-full rounded-3xl overflow-hidden ring-1 ring-border/50">
                                    <CardContent className="p-8 space-y-6">
                                        <div className="space-y-2 flex flex-col items-center text-center">
                                            {branch.location_name && (
                                                <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[16px] font-bold px-3 py-1 mb-1">
                                                    {branch.location_name}
                                                </Badge>
                                            )}
                                            <h3 className="font-bold text-xl group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                                {branch.branch_name}
                                            </h3>
                                        </div>

                                        <div className="space-y-3 text-sm text-muted-foreground">
                                            <div className="flex items-start gap-1">
                                                <span className="line-clamp-2">{branch.address}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span>ফোন: {branch.phone}</span>
                                            </div>
                                            {branch.class_time && (
                                                <div className="flex items-center gap-1 text-primary font-medium">
                                                    <span>ক্লাস টাইম: {branch.class_time}</span>
                                                </div>
                                            )}
                                        </div>

                                        <Link to="/branches" className="block pt-2">
                                            <Button variant="ghost" size="sm" className="w-full text-primary hover:text-primary hover:bg-primary/5 rounded-2xl group/btn">
                                                বিস্তারিত দেখুন
                                                <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
