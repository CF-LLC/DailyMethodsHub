export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          is_admin: boolean
          created_at: string
        }
        Insert: {
          id: string
          email: string
          is_admin?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          is_admin?: boolean
          created_at?: string
        }
        Relationships: []
      }
      methods: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          category: string
          earnings: string
          difficulty: 'Easy' | 'Medium' | 'Hard'
          time_required: string
          link: string | null
          referral_code: string | null
          icon_url: string | null
          is_active: boolean
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          title: string
          description: string
          category: string
          earnings: string
          difficulty: 'Easy' | 'Medium' | 'Hard'
          time_required: string
          link?: string | null
          referral_code?: string | null
          icon_url?: string | null
          is_active?: boolean
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          category?: string
          earnings?: string
          difficulty?: 'Easy' | 'Medium' | 'Hard'
          time_required?: string
          link?: string | null
          referral_code?: string | null
          icon_url?: string | null
          is_active?: boolean
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      daily_earnings: {
        Row: {
          id: string
          user_id: string
          method_id: string
          amount: number
          notes: string | null
          entry_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          method_id: string
          amount: number
          notes?: string | null
          entry_date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          method_id?: string
          amount?: number
          notes?: string | null
          entry_date?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      streaks: {
        Row: {
          user_id: string
          current_streak: number
          longest_streak: number
          last_entry_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          current_streak?: number
          longest_streak?: number
          last_entry_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          current_streak?: number
          longest_streak?: number
          last_entry_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'info' | 'success' | 'warning' | 'error'
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: 'info' | 'success' | 'warning' | 'error'
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'info' | 'success' | 'warning' | 'error'
          read?: boolean
          created_at?: string
        }
        Relationships: []
      }
      referral_points: {
        Row: {
          user_id: string
          points: number
          lifetime_points: number
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          points?: number
          lifetime_points?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          points?: number
          lifetime_points?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          id: string
          referrer_id: string
          referred_user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          referrer_id: string
          referred_user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          referrer_id?: string
          referred_user_id?: string
          created_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          status: string
          plan_type: string
          current_period_start: string | null
          current_period_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          status: string
          plan_type: string
          current_period_start?: string | null
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          status?: string
          plan_type?: string
          current_period_start?: string | null
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
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
