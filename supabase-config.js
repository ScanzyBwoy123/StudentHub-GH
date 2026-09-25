/* =========================================================
   STUDENTHUB GH — SUPABASE CONFIGURATION
   ========================================================= */

const SUPABASE_URL =
    "https://gwosailuqdsvttebrhen.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_A4nPzz5JrfMRicGVcyErbQ_IAeJa9Gq";

const studentHubSupabase =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );
