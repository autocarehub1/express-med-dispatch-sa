export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      delivery_requests: {
        Row: {
          assigned_driver: string | null
          created_at: string
          created_by: string | null
          current_coordinates: Json | null
          delivery_coordinates: Json | null
          delivery_location: string
          distance: number | null
          estimated_cost: number | null
          estimated_delivery: string | null
          id: string
          package_type: string | null
          pickup_coordinates: Json | null
          pickup_location: string
          priority: string | null
          status: string
          temperature: Json | null
          tracking_id: string | null
          requester_name: string | null
          company_name: string | null
        }
        Insert: {
          assigned_driver?: string | null
          created_at?: string
          created_by?: string | null
          current_coordinates?: Json | null
          delivery_coordinates?: Json | null
          delivery_location: string
          distance?: number | null
          estimated_cost?: number | null
          estimated_delivery?: string | null
          id: string
          package_type?: string | null
          pickup_coordinates?: Json | null
          pickup_location: string
          priority?: string | null
          status?: string
          temperature?: Json | null
          tracking_id?: string | null
          requester_name?: string | null
          company_name?: string | null
        }
        Update: {
          assigned_driver?: string | null
          created_at?: string
          created_by?: string | null
          current_coordinates?: Json | null
          delivery_coordinates?: Json | null
          delivery_location?: string
          distance?: number | null
          estimated_cost?: number | null
          estimated_delivery?: string | null
          id?: string
          package_type?: string | null
          pickup_coordinates?: Json | null
          pickup_location?: string
          priority?: string | null
          status?: string
          temperature?: Json | null
          tracking_id?: string | null
          requester_name?: string | null
          company_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_requests_assigned_driver_fkey"
            columns: ["assigned_driver"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_requests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          created_at: string
          current_delivery: string | null
          current_location: Json
          id: string
          name: string
          phone: string | null
          photo: string | null
          status: string
          user_id: string | null
          vehicle_type: string
        }
        Insert: {
          created_at?: string
          current_delivery?: string | null
          current_location: Json
          id: string
          name: string
          phone?: string | null
          photo?: string | null
          status?: string
          user_id?: string | null
          vehicle_type: string
        }
        Update: {
          created_at?: string
          current_delivery?: string | null
          current_location?: Json
          id?: string
          name?: string
          phone?: string | null
          photo?: string | null
          status?: string
          user_id?: string | null
          vehicle_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "drivers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tracking_updates: {
        Row: {
          created_at: string
          id: string
          location: string
          note: string | null
          request_id: string | null
          status: string
          timestamp: string
        }
        Insert: {
          created_at?: string
          id?: string
          location: string
          note?: string | null
          request_id?: string | null
          status: string
          timestamp?: string
        }
        Update: {
          created_at?: string
          id?: string
          location?: string
          note?: string | null
          request_id?: string | null
          status?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracking_updates_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "delivery_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          role: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          role?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
