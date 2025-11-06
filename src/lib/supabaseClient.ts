import { createClient } from '@supabase/supabase-js';

// Lazy initialization to avoid build-time errors
// This function creates the client only when it's actually called
function createSupabaseClient() {
    // Use placeholder values for build time if environment variables are not set
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
    // Use a valid JWT format for the placeholder
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTYwMDAwMDAwMCwiZXhwIjoxOTAwMDAwMDAwfQ.placeholder';

    return createClient(supabaseUrl, supabaseKey);
}

// Single instance
let instance: ReturnType<typeof createClient> | null = null;

// Export a function that returns the singleton instance
const getClient = () => {
    if (!instance) {
        instance = createSupabaseClient();
    }
    return instance;
};

// Export the client getter as default
export default getClient();
