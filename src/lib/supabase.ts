import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function submitLead(data: {
  email: string;
  name?: string;
  company?: string;
  use_case?: string;
}) {
  if (!supabase) {
    // Supabase not configured yet — not an error, leads are tracked in PostHog
    return { error: null };
  }

  const { error } = await supabase.from('leads').insert({
    ...data,
    source: 'selltoscientists',
    created_at: new Date().toISOString(),
  });

  return { error: error?.message };
}
