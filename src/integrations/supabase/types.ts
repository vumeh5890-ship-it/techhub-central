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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      activity_assignments: {
        Row: {
          activity_id: string
          employee_id: string
          id: string
          role: string | null
        }
        Insert: {
          activity_id: string
          employee_id: string
          id?: string
          role?: string | null
        }
        Update: {
          activity_id?: string
          employee_id?: string
          id?: string
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_assignments_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "daily_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_assignments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      announcement_reads: {
        Row: {
          announcement_id: string
          read_at: string
          user_id: string
        }
        Insert: {
          announcement_id: string
          read_at?: string
          user_id?: string
        }
        Update: {
          announcement_id?: string
          read_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcement_reads_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          body: string
          category: string
          created_at: string
          created_by: string | null
          id: string
          title: string
        }
        Insert: {
          body: string
          category?: string
          created_at?: string
          created_by?: string | null
          id?: string
          title: string
        }
        Update: {
          body?: string
          category?: string
          created_at?: string
          created_by?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      asset_assignments: {
        Row: {
          asset_id: string
          assigned_at: string
          employee_id: string | null
          id: string
          notes: string | null
          returned_at: string | null
        }
        Insert: {
          asset_id: string
          assigned_at?: string
          employee_id?: string | null
          id?: string
          notes?: string | null
          returned_at?: string | null
        }
        Update: {
          asset_id?: string
          assigned_at?: string
          employee_id?: string | null
          id?: string
          notes?: string | null
          returned_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "asset_assignments_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_assignments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          asset_code: string
          assigned_employee_id: string | null
          category: string
          condition: string | null
          created_at: string
          id: string
          location: string | null
          name: string
          notes: string | null
          purchase_date: string | null
          purchase_price: number | null
          serial_number: string | null
          status: string
          updated_at: string
          warranty_info: string | null
          warranty_until: string | null
        }
        Insert: {
          asset_code?: string
          assigned_employee_id?: string | null
          category?: string
          condition?: string | null
          created_at?: string
          id?: string
          location?: string | null
          name: string
          notes?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
          serial_number?: string | null
          status?: string
          updated_at?: string
          warranty_info?: string | null
          warranty_until?: string | null
        }
        Update: {
          asset_code?: string
          assigned_employee_id?: string | null
          category?: string
          condition?: string | null
          created_at?: string
          id?: string
          location?: string | null
          name?: string
          notes?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
          serial_number?: string | null
          status?: string
          updated_at?: string
          warranty_info?: string | null
          warranty_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_assigned_employee_id_fkey"
            columns: ["assigned_employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance: {
        Row: {
          check_in: string | null
          check_out: string | null
          corrected_by: string | null
          correction_reason: string | null
          created_at: string
          date: string
          employee_id: string
          id: string
          notes: string | null
          status: string
          updated_at: string
        }
        Insert: {
          check_in?: string | null
          check_out?: string | null
          corrected_by?: string | null
          correction_reason?: string | null
          created_at?: string
          date?: string
          employee_id: string
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          check_in?: string | null
          check_out?: string | null
          corrected_by?: string | null
          correction_reason?: string | null
          created_at?: string
          date?: string
          employee_id?: string
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          address: string | null
          company_name: string
          currency: string
          currency_symbol: string
          email: string | null
          id: number
          job_titles: string[]
          late_after: string
          logo_url: string | null
          phone: string | null
          timezone: string
          updated_at: string
          work_end: string
          work_start: string
          working_days: string[]
        }
        Insert: {
          address?: string | null
          company_name?: string
          currency?: string
          currency_symbol?: string
          email?: string | null
          id?: number
          job_titles?: string[]
          late_after?: string
          logo_url?: string | null
          phone?: string | null
          timezone?: string
          updated_at?: string
          work_end?: string
          work_start?: string
          working_days?: string[]
        }
        Update: {
          address?: string | null
          company_name?: string
          currency?: string
          currency_symbol?: string
          email?: string | null
          id?: number
          job_titles?: string[]
          late_after?: string
          logo_url?: string | null
          phone?: string | null
          timezone?: string
          updated_at?: string
          work_end?: string
          work_start?: string
          working_days?: string[]
        }
        Relationships: []
      }
      daily_activities: {
        Row: {
          attachment_url: string | null
          completion_notes: string | null
          created_at: string
          created_by: string | null
          date: string
          department_id: string | null
          description: string | null
          end_time: string | null
          id: string
          location: string | null
          priority: string
          progress: number
          responsible_employee_id: string | null
          start_time: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          attachment_url?: string | null
          completion_notes?: string | null
          created_at?: string
          created_by?: string | null
          date?: string
          department_id?: string | null
          description?: string | null
          end_time?: string | null
          id?: string
          location?: string | null
          priority?: string
          progress?: number
          responsible_employee_id?: string | null
          start_time?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          attachment_url?: string | null
          completion_notes?: string | null
          created_at?: string
          created_by?: string | null
          date?: string
          department_id?: string | null
          description?: string | null
          end_time?: string | null
          id?: string
          location?: string | null
          priority?: string
          progress?: number
          responsible_employee_id?: string | null
          start_time?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_activities_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_activities_responsible_employee_id_fkey"
            columns: ["responsible_employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          created_at: string
          description: string | null
          id: string
          manager_id: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          manager_id?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          manager_id?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_manager_fk"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_sensitive: {
        Row: {
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relation: string | null
          employee_id: string
          salary: number | null
          salary_currency: string | null
          updated_at: string
        }
        Insert: {
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relation?: string | null
          employee_id: string
          salary?: number | null
          salary_currency?: string | null
          updated_at?: string
        }
        Update: {
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relation?: string | null
          employee_id?: string
          salary?: number | null
          salary_currency?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_sensitive_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: true
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          address: string | null
          created_at: string
          department_id: string | null
          departure_authorized_by: string | null
          departure_date: string | null
          departure_reason: string | null
          email: string | null
          employee_code: string
          employment_date: string
          employment_type: string
          exit_interview_notes: string | null
          full_name: string
          gender: string | null
          id: string
          job_title: string | null
          manager_id: string | null
          notes: string | null
          phone: string | null
          photo_url: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          department_id?: string | null
          departure_authorized_by?: string | null
          departure_date?: string | null
          departure_reason?: string | null
          email?: string | null
          employee_code?: string
          employment_date?: string
          employment_type?: string
          exit_interview_notes?: string | null
          full_name: string
          gender?: string | null
          id?: string
          job_title?: string | null
          manager_id?: string | null
          notes?: string | null
          phone?: string | null
          photo_url?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          department_id?: string | null
          departure_authorized_by?: string | null
          departure_date?: string | null
          departure_reason?: string | null
          email?: string | null
          employee_code?: string
          employment_date?: string
          employment_type?: string
          exit_interview_notes?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          job_title?: string | null
          manager_id?: string | null
          notes?: string | null
          phone?: string | null
          photo_url?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employment_history: {
        Row: {
          authorized_by: string | null
          created_at: string
          department_id: string | null
          employee_id: string
          event_date: string
          event_type: string
          id: string
          notes: string | null
          position: string | null
          salary: number | null
        }
        Insert: {
          authorized_by?: string | null
          created_at?: string
          department_id?: string | null
          employee_id: string
          event_date?: string
          event_type: string
          id?: string
          notes?: string | null
          position?: string | null
          salary?: number | null
        }
        Update: {
          authorized_by?: string | null
          created_at?: string
          department_id?: string | null
          employee_id?: string
          event_date?: string
          event_type?: string
          id?: string
          notes?: string | null
          position?: string | null
          salary?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "employment_history_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employment_history_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      event_participants: {
        Row: {
          employee_id: string
          event_id: string
          id: string
        }
        Insert: {
          employee_id: string
          event_id: string
          id?: string
        }
        Update: {
          employee_id?: string
          event_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_participants_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          date: string
          description: string | null
          end_time: string | null
          id: string
          notes: string | null
          organizer: string | null
          required_resources: string | null
          start_time: string | null
          status: string
          title: string
          updated_at: string
          venue: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          created_by?: string | null
          date: string
          description?: string | null
          end_time?: string | null
          id?: string
          notes?: string | null
          organizer?: string | null
          required_resources?: string | null
          start_time?: string | null
          status?: string
          title: string
          updated_at?: string
          venue?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          date?: string
          description?: string | null
          end_time?: string | null
          id?: string
          notes?: string | null
          organizer?: string | null
          required_resources?: string | null
          start_time?: string | null
          status?: string
          title?: string
          updated_at?: string
          venue?: string | null
        }
        Relationships: []
      }
      financial_transactions: {
        Row: {
          amount: number
          category: string
          created_at: string
          created_by: string | null
          date: string
          description: string | null
          id: string
          payment_method: string | null
          receipt_path: string | null
          source: string | null
          type: string
          updated_at: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          created_by?: string | null
          date?: string
          description?: string | null
          id?: string
          payment_method?: string | null
          receipt_path?: string | null
          source?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          created_by?: string | null
          date?: string
          description?: string | null
          id?: string
          payment_method?: string | null
          receipt_path?: string | null
          source?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      leave_requests: {
        Row: {
          created_at: string
          decided_at: string | null
          decided_by: string | null
          decision_comment: string | null
          employee_id: string
          end_date: string
          id: string
          leave_type: string
          reason: string | null
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          decision_comment?: string | null
          employee_id: string
          end_date: string
          id?: string
          leave_type: string
          reason?: string | null
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          decision_comment?: string | null
          employee_id?: string
          end_date?: string
          id?: string
          leave_type?: string
          reason?: string | null
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_records: {
        Row: {
          asset_id: string
          cost: number | null
          created_at: string
          date: string
          description: string
          id: string
          performed_by: string | null
        }
        Insert: {
          asset_id: string
          cost?: number | null
          created_at?: string
          date?: string
          description: string
          id?: string
          performed_by?: string | null
        }
        Update: {
          asset_id?: string
          cost?: number | null
          created_at?: string
          date?: string
          description?: string
          id?: string
          performed_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_records_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          kind: string
          link: string | null
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          kind?: string
          link?: string | null
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          kind?: string
          link?: string | null
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          notify_announcements: boolean
          notify_events: boolean
          notify_leave: boolean
          notify_tasks: boolean
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          notify_announcements?: boolean
          notify_events?: boolean
          notify_leave?: boolean
          notify_tasks?: boolean
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          notify_announcements?: boolean
          notify_events?: boolean
          notify_leave?: boolean
          notify_tasks?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          department_id: string | null
          description: string | null
          end_date: string | null
          id: string
          lead_id: string | null
          name: string
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department_id?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          lead_id?: string | null
          name: string
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department_id?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          lead_id?: string | null
          name?: string
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      task_comments: {
        Row: {
          author_id: string
          author_name: string | null
          body: string
          created_at: string
          id: string
          task_id: string
        }
        Insert: {
          author_id?: string
          author_name?: string | null
          body: string
          created_at?: string
          id?: string
          task_id: string
        }
        Update: {
          author_id?: string
          author_name?: string | null
          body?: string
          created_at?: string
          id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_comments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assignee_id: string | null
          attachment_url: string | null
          completed_at: string | null
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: string
          project_id: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          attachment_url?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          project_id?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          attachment_url?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          project_id?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
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
      generate_my_reminders: { Args: never; Returns: undefined }
      has_any_role: {
        Args: {
          _roles: Database["public"]["Enums"]["app_role"][]
          _user_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_hr: { Args: never; Returns: boolean }
      is_manager: { Args: never; Returns: boolean }
      list_users_with_roles: {
        Args: never
        Returns: {
          email: string
          full_name: string
          roles: Database["public"]["Enums"]["app_role"][]
          user_id: string
        }[]
      }
      my_employee_id: { Args: never; Returns: string }
      notify_user: {
        Args: {
          _body: string
          _kind: string
          _link: string
          _title: string
          _user: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "admin"
        | "hr_manager"
        | "department_manager"
        | "employee"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: [
        "super_admin",
        "admin",
        "hr_manager",
        "department_manager",
        "employee",
      ],
    },
  },
} as const
