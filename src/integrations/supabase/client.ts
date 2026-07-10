import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://nhxjubscnxgrxdcnzovs.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_xcKTPI4CMXscYLkExdqbGw_U3Yh60iw";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  },
});
