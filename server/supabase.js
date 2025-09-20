const { createClient } = require('@supabase/supabase-js');
const config = require('./config');

// Create Supabase client with service key for backend operations
const supabase = createClient(config.supabase.url, config.supabase.serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

module.exports = supabase;
