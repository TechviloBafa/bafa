import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/client";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, Users, Eye, Bell, GraduationCap, ClipboardList, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { queryKeys } from "@/constants/queryKeys";

export default function AdminDashboard() {
  const { data: admissionsCount } = useQuery({
    queryKey: queryKeys.admin.dashboard.admissionsCount,
    queryFn: async () => {
      const { count, error } = await supabase
        .from("admissions")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: pendingCount } = useQuery({
    queryKey: queryKeys.admin.dashboard.pendingCount,
    queryFn: async () => {
      const { count, error } = await supabase
        .from("admissions")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: noticesCount } = useQuery({
    queryKey: queryKeys.admin.dashboard.noticesCount,
    queryFn: async () => {
      const { count, error } = await supabase
        .from("notices")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: resultsCount } = useQuery({
    queryKey: queryKeys.admin.dashboard.resultsCount,
    queryFn: async () => {
      const { count, error } = await supabase
        .from("results")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: recentAdmissions } = useQuery({
    queryKey: queryKeys.admin.dashboard.recentAdmissions,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admissions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  const stats = [
    { label: "মোট আবেদন", value: admissionsCount || 0, icon: Users, color: "bg-primary" },
    { label: "মুলতুবি আবেদন", value: pendingCount || 0, icon: ClipboardList, color: "bg-accent" },
    { label: "প্রকাশিত নোটিশ", value: noticesCount || 0, icon: Bell, color: "bg-secondary" },
    { label: "ফলাফল", value: resultsCount || 0, icon: GraduationCap, color: "bg-gold" },
  ];

  return (
    <AdminLayout title="ড্যাশবোর্ড">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`h-12 w-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Admissions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>সাম্প্রতিক ভর্তি আবেদন</CardTitle>
                <CardDescription>নতুন আবেদনসমূহ</CardDescription>
              </div>
              <Button size="sm" variant="outline" asChild>
                <Link to="/admin/admissions">সব দেখুন</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentAdmissions?.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">কোনো আবেদন নেই</p>
              ) : (
                <div className="space-y-3">
                  {recentAdmissions?.map((admission) => (
                    <div
                      key={admission.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div>
                        <p className="font-medium">{admission.student_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {admission.student_id} • {admission.course}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={admission.status === "approved" ? "default" : "secondary"}
                          className={admission.status === "approved" ? "bg-secondary" : ""}
                        >
                          {admission.status === "approved" ? "অনুমোদিত" : admission.status === "rejected" ? "প্রত্যাখ্যাত" : "মুলতুবি"}
                        </Badge>
                        <Button size="icon" variant="ghost" asChild>
                          <Link to="/admin/admissions">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>দ্রুত কার্যক্রম</CardTitle>
              <CardDescription>সাধারণ কাজসমূহ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start gap-3" variant="outline" asChild>
                <Link to="/admin/notices">
                  <Plus className="h-5 w-5" />
                  নতুন নোটিশ যোগ করুন
                </Link>
              </Button>
              <Button className="w-full justify-start gap-3" variant="outline" asChild>
                <Link to="/admin/results">
                  <FileText className="h-5 w-5" />
                  ফলাফল আপলোড করুন
                </Link>
              </Button>
              <Button className="w-full justify-start gap-3" variant="outline" asChild>
                <Link to="/admin/admissions">
                  <Users className="h-5 w-5" />
                  আবেদন পর্যালোচনা করুন
                </Link>
              </Button>
              <Button className="w-full justify-start gap-3" variant="outline" asChild>
                <Link to="/admin/videos">
                  <Video className="h-5 w-5" />
                  ভিডিও গ্যালারি ম্যানেজ করুন
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
