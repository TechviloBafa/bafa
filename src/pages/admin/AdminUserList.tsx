import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Users, Shield, ShieldAlert, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserProfile {
    user_id: string;
    full_name: string;
    email: string;
    role: string;
    created_at: string;
}

export default function AdminUserList() {
    const { user: currentUser, isSuperAdmin } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const { data: users, isLoading } = useQuery({
        queryKey: ["admin-users"],
        queryFn: async () => {
            // Fetch approved pending admins to get names/emails
            const { data: profiles, error: profileError } = await supabase
                .from("pending_admins")
                .select("user_id, full_name, email, created_at")
                .neq("status", "rejected") // Show approved and pending (if they have a role)
                .neq("status", "deleted");

            if (profileError) throw profileError;

            // Fetch roles
            const { data: roles, error: roleError } = await supabase
                .from("user_roles")
                .select("user_id, role");

            if (roleError) throw roleError;

            // Merge data
            const combinedUsers: UserProfile[] = [];

            // Map roles to profiles
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            roles.forEach((r: any) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const profile = profiles?.find((p: any) => p.user_id === r.user_id);
                if (profile) {
                    combinedUsers.push({
                        user_id: r.user_id,
                        role: r.role,
                        full_name: profile.full_name,
                        email: profile.email,
                        created_at: profile.created_at,
                    });
                }
            });

            return combinedUsers;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (userId: string) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, error } = await supabase.rpc("delete_user" as any, {
                target_user_id: userId,
            });

            if (error) throw error;
            if (!data.success) throw new Error(data.error);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
            toast({
                title: "সফল",
                description: "ব্যবহারকারী সফলভাবে ডিলিট করা হয়েছে",
            });
            setDeleteId(null);
        },
        onError: (error: Error) => {
            toast({
                title: "ত্রুটি",
                description: error.message || "ডিলিট করতে সমস্যা হয়েছে",
                variant: "destructive",
            });
            setDeleteId(null);
        },
    });

    const getRoleBadge = (role: string) => {
        switch (role) {
            case "super_admin":
                return <Badge variant="destructive" className="bg-red-600"><ShieldAlert className="w-3 h-3 mr-1" /> Super Admin</Badge>;
            case "admin":
                return <Badge variant="default" className="bg-blue-600"><Shield className="w-3 h-3 mr-1" /> Admin</Badge>;
            case "teacher":
                return <Badge variant="secondary" className="bg-green-600 text-white"><GraduationCap className="w-3 h-3 mr-1" /> Teacher</Badge>;
            default:
                return <Badge variant="outline">{role}</Badge>;
        }
    };

    return (
        <AdminLayout title="অ্যাডমিন ও শিক্ষক তালিকা">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            ব্যবহারকারী ব্যবস্থাপনা
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="text-center py-8">লোড হচ্ছে...</div>
                        ) : (
                            <div className="rounded-md border">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted/50 text-muted-foreground">
                                        <tr>
                                            <th className="p-4 font-medium">নাম & ইমেইল</th>
                                            <th className="p-4 font-medium">রোল (Role)</th>
                                            <th className="p-4 font-medium">যোগদানের তারিখ</th>
                                            {isSuperAdmin && <th className="p-4 font-medium text-right">অ্যাকশন</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users?.map((user) => (
                                            <tr key={user.user_id + user.role} className="border-t hover:bg-muted/50">
                                                <td className="p-4">
                                                    <div className="font-medium">{user.full_name}</div>
                                                    <div className="text-xs text-muted-foreground">{user.email}</div>
                                                </td>
                                                <td className="p-4">
                                                    {getRoleBadge(user.role)}
                                                </td>
                                                <td className="p-4 text-muted-foreground">
                                                    {format(new Date(user.created_at), "dd MMM yyyy")}
                                                </td>
                                                {isSuperAdmin && (
                                                    <td className="p-4 text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                            disabled={currentUser?.id === user.user_id} // Cannot delete self
                                                            onClick={() => setDeleteId(user.user_id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                        {users?.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                                    কোনো ব্যবহারকারী পাওয়া যায়নি
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
                            <AlertDialogDescription>
                                এই ব্যবহারকারীকে সিস্টেম থেকে পার্মানেন্টলি ডিলিট করা হবে। এই অ্যাকশনটি আনডু করা যাবে না।
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>বাতিল</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => deleteId && deleteMutation.mutate(deleteId)}
                            >
                                ডিলিট করুন
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AdminLayout>
    );
}
