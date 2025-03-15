export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      clients: {
        Row: {
          address: string | null
          company_id: string | null
          contact_number: string | null
          created_at: string | null
          created_by: string | null
          email: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          company_id?: string | null
          contact_number?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          company_id?: string | null
          contact_number?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      event_images: {
        Row: {
          created_at: string | null
          description: string | null
          event_id: number | null
          id: number
          image_url: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          event_id?: number | null
          id?: number
          image_url: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          event_id?: number | null
          id?: number
          image_url?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_images_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          client_id: number | null
          client_truck_license_plate: string | null
          client_truck_model: string | null
          client_truck_number: string | null
          client_truck_vin: string | null
          company_id: string
          created_at: string
          date_completed: string | null
          date_initiated: string | null
          description: string | null
          dropoff_location: string | null
          dropoff_location_point: unknown | null
          id: number
          image_url: string | null
          pickup_location: string
          pickup_location_point: unknown | null
          status: string | null
          user_id: string
        }
        Insert: {
          client_id?: number | null
          client_truck_license_plate?: string | null
          client_truck_model?: string | null
          client_truck_number?: string | null
          client_truck_vin?: string | null
          company_id?: string
          created_at?: string
          date_completed?: string | null
          date_initiated?: string | null
          description?: string | null
          dropoff_location?: string | null
          dropoff_location_point?: unknown | null
          id?: number
          image_url?: string | null
          pickup_location: string
          pickup_location_point?: unknown | null
          status?: string | null
          user_id?: string
        }
        Update: {
          client_id?: number | null
          client_truck_license_plate?: string | null
          client_truck_model?: string | null
          client_truck_number?: string | null
          client_truck_vin?: string | null
          company_id?: string
          created_at?: string
          date_completed?: string | null
          date_initiated?: string | null
          description?: string | null
          dropoff_location?: string | null
          dropoff_location_point?: unknown | null
          id?: number
          image_url?: string | null
          pickup_location?: string
          pickup_location_point?: unknown | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          company_id: string
          email: string
          expires_at: string | null
          id: string
          role: string
          token: string
        }
        Insert: {
          company_id: string
          email: string
          expires_at?: string | null
          id?: string
          role: string
          token: string
        }
        Update: {
          company_id?: string
          email?: string
          expires_at?: string | null
          id?: string
          role?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_id: string | null
          current_location: unknown | null
          full_name: string | null
          id: string
          on_duty: boolean | null
          role: string | null
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_id?: string | null
          current_location?: unknown | null
          full_name?: string | null
          id: string
          on_duty?: boolean | null
          role?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_id?: string | null
          current_location?: unknown | null
          full_name?: string | null
          id?: string
          on_duty?: boolean | null
          role?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      truck_locations: {
        Row: {
          event_id: number | null
          id: number
          last_updated: string | null
          location_source: string | null
          profile_id: string | null
          truck_id: string
        }
        Insert: {
          event_id?: number | null
          id?: number
          last_updated?: string | null
          location_source?: string | null
          profile_id?: string | null
          truck_id?: string
        }
        Update: {
          event_id?: number | null
          id?: number
          last_updated?: string | null
          location_source?: string | null
          profile_id?: string | null
          truck_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_profile"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_truck_id"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "truck_locations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      trucks: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: string
          license_plate: string
          model: string | null
          name: string
          updated_at: string | null
          year: number | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          license_plate: string
          model?: string | null
          name: string
          updated_at?: string | null
          year?: number | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          license_plate?: string
          model?: string | null
          name?: string
          updated_at?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "trucks_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
