import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { queryKeys } from "@/constants/queryKeys";

interface PendingAdmin {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
  user_id: string;
  status: string;
}

export default function PendingAdminApprovals() {
  const { user, roles } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pendingAdmins, isLoading, error } = useQuery({
    queryKey: ["pending-admins"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pending_admins")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as PendingAdmin[] || [];
    },
    meta: {
      onError: () => {
        toast({
          title: "ত্রুটি!",
          description: "অপেক্ষমাণ আবেদন লোড করতে সমস্যা হয়েছে।",
          variant: "destructive",
        });
      },
    },
  });

  // Track selected role for each pending admin
  const [roleSelections, setRoleSelections] = useState<Record<string, string>>({});

  const approveMutation = useMutation({
    mutationFn: async ({ pendingAdminId, role }: { pendingAdminId: string; role: string }) => {
      // Get the pending admin with user_id
      const { data: pendingData } = await supabase
        .from("pending_admins")
        .select("user_id, email")
        .eq("id", pendingAdminId)
        .single();

      if (!pendingData?.user_id) {
        throw new Error("ব্যবহারকারী আইডি পাওয়া যায়নি");
      }

      // Use RPC function to assign role (SECURITY DEFINER)
      const { data, error: rpcError } = await supabase
        .rpc("assign_admin_role", {
          target_user_id: pendingData.user_id,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          target_role: role as any,
        });

      if (rpcError) throw rpcError;
      if (!data?.success) throw new Error(data?.error || "ভূমিকা নির্ধারণে সমস্যা হয়েছে");

      // Update pending_admins status
      const { error: updateError } = await supabase
        .from("pending_admins")
        .update({
          status: "approved",
          approved_at: new Date().toISOString(),
          approved_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq("id", pendingAdminId);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-admins"] });
      toast({
        title: "অনুমোদিত!",
        description: "শিক্ষক সফলভাবে অনুমোদিত হয়েছেন।",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "ত্রুটি!",
        description: error.message || "অনুমোদনে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (pendingAdminId: string) => {
      const { error } = await supabase
        .from("pending_admins")
        .update({ status: "rejected" })
        .eq("id", pendingAdminId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-admins"] });
      toast({
        title: "প্রত্যাখ্যাত!",
        description: "আবেদন প্রত্যাখ্যান করা হয়েছে।",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "ত্রুটি!",
        description: error.message || "প্রত্যাখ্যানে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    },
  });

  return (
    <AdminLayout title="অপেক্ষমাণ অনুমোদনসমূহ">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              শিক্ষক/প্রশাসক অনুমোদন অপেক্ষা করছে
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">লোড করছি...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                <p>ডেটা লোড করতে সমস্যা হয়েছে</p>
              </div>
            ) : pendingAdmins && pendingAdmins.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">কোনো অপেক্ষমাণ আবেদন নেই</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingAdmins.map((pending: PendingAdmin) => {
                  // Only super_admin can assign super_admin role
                  const canAssignSuperAdmin = roles?.includes("super_admin");
                  const roleOptions = [
                    { value: "teacher", label: "Teacher" },
                    { value: "admin", label: "Admin" },
                    ...(canAssignSuperAdmin ? [{ value: "super_admin", label: "Super Admin" }] : []),
                  ];
                  return (
                    <div
                      key={pending.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-lg">{pending.full_name}</p>
                        <p className="text-sm text-muted-foreground">{pending.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          আবেদন: {format(new Date(pending.created_at), "dd MMM yyyy, HH:mm")}
                        </p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <select
                          className="border rounded px-2 py-1 text-sm bg-background"
                          value={roleSelections[pending.id] || "teacher"}
                          onChange={e => setRoleSelections(s => ({ ...s, [pending.id]: e.target.value }))}
                        >
                          {roleOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => approveMutation.mutate({ pendingAdminId: pending.id, role: roleSelections[pending.id] || "teacher" })}
                          disabled={approveMutation.isPending}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          অনুমোদন
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => rejectMutation.mutate(pending.id)}
                          disabled={rejectMutation.isPending}
                        >
                          <X className="h-4 w-4 mr-1" />
                          প্রত্যাখ্যান
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
