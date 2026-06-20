const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseAnonKey = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data, error } = await supabase
    .from('users')
    .select('id, username, full_name, semester, xp, level, streak, last_active_date, energy_mode, shortcuts_enabled, created_at, updated_at')
    .limit(1);

  if (error) {
    console.error('Error with safe columns select:', error);
  } else {
    console.log('Safe columns select SUCCEEDED! User data:', data);
  }
}

run().catch(console.error);
