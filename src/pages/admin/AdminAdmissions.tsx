import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, XCircle, Users, Trash2 } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { withTimeout } from "@/utils/promiseUtils";

const statusOptions = [
  { value: "pending", label: "পেন্ডিং", variant: "secondary" as const },
  { value: "approved", label: "এপ্রুভ করুন", variant: "default" as const },
  { value: "rejected", label: "বাতিল করুন", variant: "destructive" as const },
];

export interface AdminAdmission {
  id: string;
  student_id: string;
  student_name: string;
  father_name: string;
  mother_name: string | null;
  date_of_birth: string;
  course: string;
  phone: string;
  email: string | null;
  address: string | null;
  status: string;
  created_at: string;
}

export default function AdminAdmissions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAdmission, setSelectedAdmission] = useState<AdminAdmission | null>(null);
  const [admissionToDelete, setAdmissionToDelete] = useState<AdminAdmission | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const { data: admissions, isLoading } = useQuery({
    queryKey: ["admin-admissions", filterStatus],
    queryFn: async () => {
      let query = supabase
        .from("admissions")
        .select("id, student_id, student_name, course, status, created_at")
        .order("created_at", { ascending: false })
        .limit(100);

      if (filterStatus !== "all") {
        query = query.eq("status", filterStatus);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 30, // 30 seconds
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const result = await withTimeout(
        supabase
          .from("admissions")
          .update({ status })
          .eq("id", id),
        30000,
        "স্ট্যাটাস আপডেট করতে সময় বেশি লাগছে।"
      );
      if (result.error) throw result.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-admissions"] });
      toast({ title: "সফল!", description: "স্ট্যাটাস আপডেট করা হয়েছে।" });
    },
    onError: () => {
      toast({ title: "ত্রুটি!", description: "স্ট্যাটাস আপডেট করতে ব্যর্থ হয়েছে।", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await withTimeout(
        supabase.from("admissions").delete().eq("id", id),
        30000,
        "আবেদন মুছে ফেলতে সময় বেশি লাগছে।"
      );
      if (result.error) throw result.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-admissions"] });
      toast({ title: "সফল!", description: "আবেদনটি সফলভাবে মুছে ফেলা হয়েছে।" });
      setIsDeleteDialogOpen(false);
      setAdmissionToDelete(null);
    },
    onError: (error: any) => {
      toast({
        title: "ত্রুটি!",
        description: `আবেদন মুছে ফেলতে সমস্যা হয়েছে: ${error.message || "Unknown error"}`,
        variant: "destructive"
      });
    },
  });

  const getStatusBadge = (status: string) => {
    const option = statusOptions.find((o) => o.value === status);
    return (
      <Badge variant={option?.variant || "secondary"}>
        {option?.label || status}
      </Badge>
    );
  };

  return (
    <AdminLayout title="ভর্তি আবেদন">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">সকল ভর্তি আবেদন পরিচালনা করুন</p>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="ফিল্টার করুন" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">সব দেখুন</SelectItem>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="text-center py-8">লোড হচ্ছে...</div>
        ) : admissions?.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">কোনো আবেদন নেই</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>আবেদন আইডি</TableHead>
                    <TableHead>শিক্ষার্থীর নাম</TableHead>
                    <TableHead>কোর্স</TableHead>
                    <TableHead>তারিখ</TableHead>
                    <TableHead>স্ট্যাটাস</TableHead>
                    <TableHead className="text-right">কার্যক্রম</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admissions?.map((admission) => (
                    <TableRow key={admission.id}>
                      <TableCell className="font-medium">{admission.student_id}</TableCell>
                      <TableCell>{admission.student_name}</TableCell>
                      <TableCell>{admission.course}</TableCell>
                      <TableCell>{format(new Date(admission.created_at), "dd/MM/yyyy")}</TableCell>
                      <TableCell>{getStatusBadge(admission.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={async () => {
                            const { data, error } = await supabase
                              .from("admissions")
                              .select("*")
                              .eq("id", admission.id)
                              .single();
                            if (error) {
                              toast({ title: "ত্রুটি!", description: "বিস্তারিত লোড করা যায়নি।", variant: "destructive" });
                            } else {
                              setSelectedAdmission(data as AdminAdmission);
                            }
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {admission.status === "pending" && (
                          <>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-green-600"
                              onClick={() =>
                                updateStatusMutation.mutate({
                                  id: admission.id,
                                  status: "approved",
                                })
                              }
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-destructive"
                              onClick={() =>
                                updateStatusMutation.mutate({
                                  id: admission.id,
                                  status: "rejected",
                                })
                              }
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            setAdmissionToDelete(admission as AdminAdmission);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Detail Dialog */}
        <Dialog open={!!selectedAdmission} onOpenChange={() => setSelectedAdmission(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>আবেদন বিস্তারিত</DialogTitle>
            </DialogHeader>
            {selectedAdmission && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">আবেদন আইডি</p>
                    <p className="font-medium">{selectedAdmission.student_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">স্ট্যাটাস</p>
                    {getStatusBadge(selectedAdmission.status)}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">শিক্ষার্থীর নাম</p>
                  <p className="font-medium">{selectedAdmission.student_name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">পিতার নাম</p>
                    <p className="font-medium">{selectedAdmission.father_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">মাতার নাম</p>
                    <p className="font-medium">{selectedAdmission.mother_name || "-"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">জন্ম তারিখ</p>
                    <p className="font-medium">
                      {format(new Date(selectedAdmission.date_of_birth), "dd/MM/yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">কোর্স</p>
                    <p className="font-medium">{selectedAdmission.course}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">ফোন</p>
                    <p className="font-medium">{selectedAdmission.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ইমেইল</p>
                    <p className="font-medium">{selectedAdmission.email || "-"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ঠিকানা</p>
                  <p className="font-medium">{selectedAdmission.address || "-"}</p>
                </div>
                {selectedAdmission.status === "pending" && (
                  <div className="flex gap-2 pt-4">
                    <Button
                      className="flex-1"
                      onClick={() => {
                        updateStatusMutation.mutate({
                          id: selectedAdmission.id,
                          status: "approved",
                        });
                        setSelectedAdmission(null);
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      অনুমোদন করুন
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => {
                        updateStatusMutation.mutate({
                          id: selectedAdmission.id,
                          status: "rejected",
                        });
                        setSelectedAdmission(null);
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      প্রত্যাখ্যান করুন
                    </Button>
                  </div>
                )}
                <div className="pt-2 border-t">
                  <Button
                    variant="outline"
                    className="w-full text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => {
                      setAdmissionToDelete(selectedAdmission);
                      setIsDeleteDialogOpen(true);
                      setSelectedAdmission(null);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    আবেদনটি মুছে ফেলুন
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Alert */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>আবেদন মুছে ফেলতে চান?</AlertDialogTitle>
              <AlertDialogDescription>
                আপনি কি নিশ্চিত যে এই আবেদনটি মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>বাতিল</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => admissionToDelete && deleteMutation.mutate(admissionToDelete.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteMutation.isPending ? "মুছে ফেলা হচ্ছে..." : "মুছে ফেলুন"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div >
    </AdminLayout >
  );
}
