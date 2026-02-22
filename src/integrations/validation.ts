import { z } from "zod";

// Notice validation
export const noticeSchema = z.object({
  title: z.string().trim().min(1, "শিরোনাম প্রয়োজন").max(200, "শিরোনাম ২০০ অক্ষরের মধ্যে হতে হবে"),
  content: z.string().trim().min(1, "বিস্তারিত প্রয়োজন").max(5000, "বিস্তারিত ৫০০০ অক্ষরের মধ্যে হতে হবে"),
  category: z.string().min(1, "ক্যাটাগরি প্রয়োজন"),
  is_new: z.boolean().optional().default(true),
});

export type NoticeFormData = z.infer<typeof noticeSchema>;

// Result validation
export const resultSchema = z.object({
  student_id: z.string().trim().min(1, "শিক্ষার্থী আইডি প্রয়োজন"),
  student_name: z.string().trim().min(1, "শিক্ষার্থীর নাম প্রয়োজন"),
  course: z.string().min(1, "কোর্স প্রয়োজন"),
  exam_type: z.string().min(1, "পরীক্ষার ধরন প্রয়োজন"),
  exam_year: z.string().min(4, "বছর প্রয়োজন"),
  total_marks: z.number().min(0, "মোট নম্বর ০ বা তার বেশি হতে হবে").max(100, "সর্বোচ্চ ১০০ হতে পারে"),
  gpa: z.number().min(0, "জিপিএ ০ বা তার বেশি হতে হবে").max(4, "সর্বোচ্চ ৪.০ হতে পারে"),
  grade: z.string().min(1, "গ্রেড প্রয়োজন"),
});

export type ResultFormData = z.infer<typeof resultSchema>;

// Branch validation
export const branchSchema = z.object({
  name: z.string().trim().min(1, "শাখার নাম প্রয়োজন").max(200),
  address: z.string().trim().min(1, "ঠিকানা প্রয়োজন").max(500),
  phone: z.string().trim().min(11, "সঠিক ফোন নম্বর দিন").max(15),
  email: z.string().email("সঠিক ইমেইল দিন").optional().or(z.literal("")),
  established: z.string().optional().or(z.literal("")),
  students: z.number().min(0).optional().default(0),
  teachers: z.number().min(0).optional().default(0),
  image_url: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  facilities: z.string().optional().or(z.literal("")),
  is_active: z.boolean().optional().default(true),
});

export type BranchFormData = z.infer<typeof branchSchema>;

// Admission validation
export const admissionSchema = z.object({
  student_name: z.string().trim().min(1, "নাম আবশ্যক").max(100),
  father_name: z.string().trim().min(1, "পিতার নাম আবশ্যক").max(100),
  mother_name: z.string().trim().max(100).optional().or(z.literal("")),
  date_of_birth: z.string().min(1, "জন্ম তারিখ আবশ্যক"),
  course: z.string().min(1, "কোর্স নির্বাচন আবশ্যক"),
  phone: z.string().trim().min(11, "সঠিক মোবাইল নম্বর দিন").max(15),
  email: z.string().email("সঠিক ইমেইল দিন").optional().or(z.literal("")),
  address: z.string().trim().max(500).optional().or(z.literal("")),
});

export type AdmissionFormData = z.infer<typeof admissionSchema>;

// Validation error handler
export function getValidationErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  error.errors.forEach((err) => {
    const path = err.path.join(".");
    errors[path] = err.message;
  });
  return errors;
}