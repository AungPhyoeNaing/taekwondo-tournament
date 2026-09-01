import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uihtvjizdjtsmhtasjqf.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpaHR2aml6ZGp0c21odGFzanFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNjE0MjcsImV4cCI6MjEwMzgzNzQyN30.zSr4f8-nWOLsHXAGge0uUlNy7zmo9qBUbjjN7JGZY3Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SupabaseHealthStatus {
  connected: boolean;
  tableExists: boolean;
  error?: string;
  count?: number;
}

export async function checkSupabaseHealth(): Promise<SupabaseHealthStatus> {
  try {
    const { count, error } = await supabase
      .from('players')
      .select('id', { count: 'exact' })
      .limit(1);

    if (error) {
      // PostgREST 404 / PGRST205 means table doesn't exist in schema cache
      if (error.code === 'PGRST205' || error.message.includes('Could not find the table') || error.code === '42P01') {
        return {
          connected: true,
          tableExists: false,
          error: 'Table "players" not found in Supabase schema.'
        };
      }
      return {
        connected: false,
        tableExists: false,
        error: error.message
      };
    }

    return {
      connected: true,
      tableExists: true,
      count: count ?? 0
    };
  } catch (err: unknown) {
    return {
      connected: false,
      tableExists: false,
      error: err instanceof Error ? err.message : 'Failed to connect to Supabase'
    };
  }
}
