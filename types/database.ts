/** Supabase-generated types placeholder.
 *  In production, generate with: npx supabase gen types typescript
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          slug: string;
          display_name: string;
          avatar_url: string | null;
          persona: 'individual' | 'business';
          template_id: string;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          slug: string;
          display_name: string;
          avatar_url?: string | null;
          persona: 'individual' | 'business';
          template_id?: string;
          is_published?: boolean;
        };
        Update: {
          slug?: string;
          display_name?: string;
          avatar_url?: string | null;
          persona?: 'individual' | 'business';
          template_id?: string;
          is_published?: boolean;
        };
      };
      blocks: {
        Row: {
          id: string;
          profile_id: string;
          type: string;
          position: number;
          is_active: boolean;
          props: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          type: string;
          position?: number;
          is_active?: boolean;
          props?: Json;
        };
        Update: {
          type?: string;
          position?: number;
          is_active?: boolean;
          props?: Json;
        };
      };
      events: {
        Row: {
          id: string;
          profile_id: string;
          type: string;
          block_id: string | null;
          metadata: Json;
          ip_hash: string | null;
          user_agent: string | null;
          referrer: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          type: string;
          block_id?: string | null;
          metadata?: Json;
          ip_hash?: string | null;
          user_agent?: string | null;
          referrer?: string | null;
        };
        Update: never;
      };
      templates: {
        Row: {
          id: string;
          name: string;
          styles: Json;
        };
        Insert: {
          id: string;
          name: string;
          styles: Json;
        };
        Update: {
          name?: string;
          styles?: Json;
        };
      };
      reserved_slugs: {
        Row: { slug: string };
        Insert: { slug: string };
        Update: never;
      };
    };
  };
}
