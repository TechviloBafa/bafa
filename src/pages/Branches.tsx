import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPin, Phone, Mail, Search, Building2, Users, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/client";

interface Branch {
  id: string;
  branch_name: string;
  address: string;
  phone: string;
  email: string | null;
  established: string | null;
  students: number | null;
  teachers: number | null;
  image_url: string | null;
  description: string | null;
  facilities: string[] | null;
  class_time: string | null;
}

export default function Branches() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const { data: branches, isLoading } = useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from("branches" as any) // eslint-disable-line @typescript-eslint/no-explicit-any
        .select("*")
        .eq("is_active", true)
        .order("branch_name"));
      if (error) throw error;
      return (data as any) as Branch[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const filteredBranches = branches?.filter((branch) =>
    (branch.branch_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (branch.address?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        {/* Header Section */}
        <section className="py-12 bg-primary/5">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-4"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-7 w-7 text-primary" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                আমাদের শাখাসমূহ
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                সারাদেশে বুলবুল ললিতকলা একাডেমীর {branches?.length} টি শাখায় শিল্প ও সংস্কৃতির চর্চা চলছে
              </p>

              {/* Search */}
              <div className="max-w-md mx-auto mt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="শাখা খুঁজুন (নাম বা ঠিকানা)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Badge variant="secondary" className="mt-4">
                মোট {filteredBranches.length} টি শাখা
              </Badge>
            </motion.div>
          </div>
        </section>

        {/* Branches Grid */}
        <section className="py-12">
          <div className="container">
            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="h-full">
                    <CardContent className="p-4 space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-9 w-full mt-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredBranches.map((branch, index) => (
                    <motion.div
                      key={branch.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.02 }}
                    >
                      <Card
                        className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary/30 h-full"
                        onClick={() => setSelectedBranch(branch)}
                      >
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">
                              {branch.branch_name}
                            </h3>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-2 text-muted-foreground">
                              <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                              <span className="line-clamp-2">{branch.address}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Phone className="h-4 w-4 shrink-0" />
                              <span>{branch.phone}</span>
                            </div>
                            {branch.class_time && (
                              <div className="flex items-center gap-2 text-primary font-medium">
                                <Clock className="h-4 w-4 shrink-0" />
                                <span>{branch.class_time}</span>
                              </div>
                            )}
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full mt-2 group-hover:bg-primary/10"
                          >
                            বিস্তারিত দেখুন
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {filteredBranches.length === 0 && (
                  <div className="text-center py-12">
                    <Building2 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">কোনো শাখা পাওয়া যায়নি</p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>

      {/* Branch Details Dialog */}
      <Dialog open={!!selectedBranch} onOpenChange={() => setSelectedBranch(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedBranch && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedBranch.branch_name}</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Branch Image */}
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <img
                    src={selectedBranch.image_url || "/placeholder.svg"}
                    alt={selectedBranch.branch_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </div>

                {/* Description */}
                <p className="text-muted-foreground">{selectedBranch.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <Users className="h-6 w-6 mx-auto text-primary mb-2" />
                    <div className="text-2xl font-bold text-primary">{selectedBranch.students}</div>
                    <div className="text-xs text-muted-foreground">শিক্ষার্থী</div>
                  </div>
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <Users className="h-6 w-6 mx-auto text-primary mb-2" />
                    <div className="text-2xl font-bold text-primary">{selectedBranch.teachers}</div>
                    <div className="text-xs text-muted-foreground">শিক্ষক</div>
                  </div>
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <Clock className="h-6 w-6 mx-auto text-primary mb-2" />
                    <div className="text-2xl font-bold text-primary">{selectedBranch.established}</div>
                    <div className="text-xs text-muted-foreground">প্রতিষ্ঠিত</div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-3">
                  <h4 className="font-semibold">যোগাযোগ</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{selectedBranch.address}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>{selectedBranch.phone}</span>
                    </div>
                    {selectedBranch.class_time && (
                      <div className="flex items-center gap-3 text-sm font-medium text-primary">
                        <Clock className="h-4 w-4" />
                        <span>ক্লাস টাইম: {selectedBranch.class_time}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-primary" />
                      <span>{selectedBranch.email}</span>
                    </div>
                  </div>
                </div>

                {/* Facilities */}
                <div className="space-y-3">
                  <h4 className="font-semibold">সুযোগ-সুবিধা</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedBranch.facilities?.map((facility, i) => (
                      <Badge key={i} variant="secondary">
                        {facility}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
