import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Phone, Building2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/client";

interface Branch {
    id: string;
    branch_name: string;
    address: string;
    phone: string;
}

export function BranchSection() {
    const { data: branches, isLoading } = useQuery({
        queryKey: ["branches-home"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("branches" as any)
                .select("id, branch_name, address, phone")
                .eq("is_active", true)
                .order("branch_name")
                .limit(8);
            if (error) throw error;
            return (data as any) as Branch[];
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
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
                                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/30 h-full">
                                    <CardContent className="p-6 space-y-4">
                                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Building2 className="h-6 w-6 text-primary" />
                                        </div>

                                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-1">
                                            {branch.branch_name}
                                        </h3>

                                        <div className="space-y-2 text-sm text-muted-foreground">
                                            <div className="flex items-start gap-2">
                                                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-primary/60" />
                                                <span className="line-clamp-2">{branch.address}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 shrink-0 text-primary/60" />
                                                <span>{branch.phone}</span>
                                            </div>
                                        </div>

                                        <Link to="/branches" className="block pt-2">
                                            <Button variant="ghost" size="sm" className="w-full text-primary hover:text-primary hover:bg-primary/5">
                                                বিস্তারিত দেখুন
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
