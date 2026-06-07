const SUPABASE_URL = "https://jzvfkgkhsmibqmikizbn.supabase.co/rest/v1/";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6dmZrZ2toc21pYnFtaWtpemJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NjU5ODMsImV4cCI6MjA5NjM0MTk4M30._A5YRROwgDQRo9wuqzzDld2Vf4aBUZ8EQR8Uob56ISE";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);