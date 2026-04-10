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
          username: string | null 
          full_name: string | null 
          avatar_url: string | null 
          bio: string 
          created_at: string 
          updated_at: string 
        } 
        Insert: { 
          id: string 
          username?: string | null 
          full_name?: string | null 
          avatar_url?: string | null 
          bio?: string 
          created_at?: string 
          updated_at?: string 
        } 
        Update: { 
          id?: string 
          username?: string | null 
          full_name?: string | null 
          avatar_url?: string | null 
          bio?: string 
          created_at?: string 
          updated_at?: string 
        } 
      } 
      monsters: { 
        Row: { 
          id: string 
          user_id: string 
          name: string 
          type: string 
          stage: number 
          experience: number 
          skill_points: number 
          created_at: string 
          updated_at: string 
        } 
        Insert: { 
          id?: string 
          user_id: string 
          name: string 
          type: string 
          stage?: number 
          experience?: number 
          skill_points?: number 
          created_at?: string 
          updated_at?: string 
        } 
        Update: { 
          id?: string 
          user_id?: string 
          name?: string 
          type?: string 
          stage?: number 
          experience?: number 
          skill_points?: number 
          created_at?: string 
          updated_at?: string 
        } 
      } 
      dna_dimensions: {
        Row: {
          id: string
          monster_id: string
          dimensions: Json
          personality_type: string | null
          analysis_summary: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          monster_id: string
          dimensions?: Json
          personality_type?: string | null
          analysis_summary?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          monster_id?: string
          dimensions?: Json
          personality_type?: string | null
          analysis_summary?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      emotion_records: {
        Row: {
          id: string
          user_id: string
          monster_id: string | null
          emotion: string
          intensity: number | null
          context: string | null
          source: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          monster_id?: string | null
          emotion: string
          intensity?: number | null
          context?: string | null
          source?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          monster_id?: string | null
          emotion?: string
          intensity?: number | null
          context?: string | null
          source?: string | null
          created_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          user_id: string
          monster_id: string
          role: string
          content: string
          emotion: string | null
          tokens_used: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          monster_id: string
          role: string
          content: string
          emotion?: string | null
          tokens_used?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          monster_id?: string
          role?: string
          content?: string
          emotion?: string | null
          tokens_used?: number
          created_at?: string
        }
      }
      planet_configs: {
        Row: {
          id: string
          monster_id: string
          terrain_type: string
          weather: string
          theme_color: string
          decorations: Json
          atmosphere_density: number
          gravity_level: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          monster_id: string
          terrain_type?: string
          weather?: string
          theme_color?: string
          decorations?: Json
          atmosphere_density?: number
          gravity_level?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          monster_id?: string
          terrain_type?: string
          weather?: string
          theme_color?: string
          decorations?: Json
          atmosphere_density?: number
          gravity_level?: number
          created_at?: string
          updated_at?: string
        }
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
  } 
} 
