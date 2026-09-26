/* =========================================================
   STUDENTHUB GH — SUPABASE CONFIGURATION
========================================================= */

const SUPABASE_URL =
    "https://gwosailuqdsvttebrhen.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_A4nPzz5JrfMRicGVcyErbQ_IAeJa9Gq";

/*
 * Keep the login session only for the current browser tab.
 *
 * This prevents StudentHub from automatically remembering
 * a previous student's login after the browser session ends.
 */

const studentHubSupabase =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY,
        {
            auth: {
                persistSession: true,
                storage: window.sessionStorage,
                autoRefreshToken: true,
                detectSessionInUrl: true
            }
        }
    );
