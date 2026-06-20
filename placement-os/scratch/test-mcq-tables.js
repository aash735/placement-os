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
  console.log('Testing mcq_attempts SELECT...');
  const { data: att, error: attErr } = await supabase.from('mcq_attempts').select('*').limit(1);
  console.log('mcq_attempts:', { data: att, error: attErr });

  console.log('Testing mcq_bookmarks SELECT...');
  const { data: bkm, error: bkmErr } = await supabase.from('mcq_bookmarks').select('*').limit(1);
  console.log('mcq_bookmarks:', { data: bkm, error: bkmErr });

  console.log('Testing mcq_sessions SELECT...');
  const { data: ses, error: sesErr } = await supabase.from('mcq_sessions').select('*').limit(1);
  console.log('mcq_sessions:', { data: ses, error: sesErr });
}

run().catch(console.error);
