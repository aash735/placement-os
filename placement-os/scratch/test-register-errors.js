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
  console.log('Testing registration with a duplicate username (john_doe)...');
  const res1 = await supabase.rpc('register_user', {
    p_username: 'john_doe',
    p_password: 'password123',
    p_full_name: 'John Doe Duplicate',
    p_semester: '7th Semester — Placement Season'
  });
  console.log('Result for duplicate username:', res1);

  console.log('\nTesting registration with null/empty full name (violating NOT NULL full_name constraint)...');
  const res2 = await supabase.rpc('register_user', {
    p_username: 'test_empty_name_' + Date.now(),
    p_password: 'password123',
    p_full_name: null, // should trigger a DB error or constraint violation
    p_semester: '7th Semester — Placement Season'
  });
  console.log('Result for null full name:', res2);
}

run().catch(console.error);
