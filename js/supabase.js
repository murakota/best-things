// Connects your site to your Supabase database.
// These two values are SAFE to be public: the publishable key can only do
// what your Row Level Security rules allow (read totals, add a vote).
// NEVER put the "secret" / service_role key here.
const SUPABASE_URL = "https://vwseoggvidxyrkevcklp.supabase.co";
const SUPABASE_KEY = "sb_publishable_qagymfClQhLX_ZxmLpgNDA_OP6SWAC3";

// `supabase` is the library loaded from the CDN; `db` is our live connection.
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
