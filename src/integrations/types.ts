export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      pending_admins: {
        Row: {
          id: string;
          user_id: string | null;
          email: string;
          full_name: string;
          status: string;
          approved_by: string | null;
          approved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          email: string;
          full_name: string;
          status?: string;
          approved_by?: string | null;
          approved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          email?: string;
          full_name?: string;
          status?: string;
          approved_by?: string | null;
          approved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      admissions: {
        Row: {
          address: string | null
          course: string
          created_at: string
          date_of_birth: string
          email: string | null
          father_name: string
          id: string
          mother_name: string | null
          phone: string
          photo_url: string | null
          status: string
          student_id: string
          student_name: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          course: string
          created_at?: string
          date_of_birth: string
          email?: string | null
          father_name: string
          id?: string
          mother_name?: string | null
          phone: string
          photo_url?: string | null
          status?: string
          student_id: string
          student_name: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          course?: string
          created_at?: string
          date_of_birth?: string
          email?: string | null
          father_name?: string
          id?: string
          mother_name?: string | null
          phone?: string
          photo_url?: string | null
          status?: string
          student_id?: string
          student_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      branches: {
        Row: {
          address: string
          class_time: string | null
          created_at: string
          description: string | null
          email: string | null
          established: string | null
          facilities: string[] | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          phone: string
          students: number | null
          teachers: number | null
          updated_at: string
        }
        Insert: {
          address: string
          class_time?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          established?: string | null
          facilities?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          phone: string
          students?: number | null
          teachers?: number | null
          updated_at?: string
        }
        Update: {
          address?: string
          class_time?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          established?: string | null
          facilities?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          phone?: string
          students?: number | null
          teachers?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      notices: {
        Row: {
          attachment_url: string | null
          category: string
          content: string
          created_at: string
          created_by: string | null
          has_attachment: boolean
          id: string
          is_new: boolean
          title: string
          updated_at: string
        }
        Insert: {
          attachment_url?: string | null
          category?: string
          content: string
          created_at?: string
          created_by?: string | null
          has_attachment?: boolean
          id?: string
          is_new?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          attachment_url?: string | null
          category?: string
          content?: string
          created_at?: string
          created_by?: string | null
          has_attachment?: boolean
          id?: string
          is_new?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      results: {
        Row: {
          course: string
          created_at: string
          created_by: string | null
          exam_type: string
          exam_year: string
          gpa: number | null
          grade: string | null
          id: string
          marks: Json
          student_id: string
          student_name: string
          total_marks: number | null
          updated_at: string
        }
        Insert: {
          course: string
          created_at?: string
          created_by?: string | null
          exam_type: string
          exam_year: string
          gpa?: number | null
          grade?: string | null
          id?: string
          marks?: Json
          student_id: string
          student_name: string
          total_marks?: number | null
          updated_at?: string
        }
        Update: {
          course?: string
          created_at?: string
          created_by?: string | null
          exam_type?: string
          exam_year?: string
          gpa?: number | null
          grade?: string | null
          id?: string
          marks?: Json
          student_id?: string
          student_name?: string
          total_marks?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        pending_admins: {
          Row: {
            id: string;
            user_id: string | null;
            email: string;
            full_name: string;
            status: string;
            approved_by: string | null;
            approved_at: string | null;
            created_at: string;
            updated_at: string;
          };
          Insert: {
            id?: string;
            user_id?: string | null;
            email: string;
            full_name: string;
            status?: string;
            approved_by?: string | null;
            approved_at?: string | null;
            created_at?: string;
            updated_at?: string;
          };
          Update: {
            id?: string;
            user_id?: string | null;
            email?: string;
            full_name?: string;
            status?: string;
            approved_by?: string | null;
            approved_at?: string | null;
            created_at?: string;
            updated_at?: string;
          };
          Relationships: [];
        };
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      assign_admin_role: {
        Args: {
          target_user_id: string;
          target_role?: Database["public"]["Enums"]["app_role"];
        };
        Returns: { success: boolean; error?: string; message?: string };
      };
    }
    Enums: {
      app_role: "admin" | "super_admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
    DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
    DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema["Enums"]
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "super_admin", "user"],
    },
  },
} as const
