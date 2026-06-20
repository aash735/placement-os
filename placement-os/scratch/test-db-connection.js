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

console.log('Connecting to Supabase at:', supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log('1. Fetching first 5 users to verify connection & table...');
  const { data: users, error: usersErr } = await supabase
    .from('users')
    .select('id, username, full_name, semester, xp, level')
    .limit(5);

  if (usersErr) {
    console.error('Error fetching users:', usersErr);
  } else {
    console.log('Users found:', users);
  }

  console.log('\n2. Attempting to call register_user with test data...');
  const testUsername = 'test_user_inspector_' + Math.random().toString(36).substring(7);
  console.log('Testing username:', testUsername);
  
  const { data: regData, error: regErr } = await supabase.rpc('register_user', {
    p_username: testUsername,
    p_password: 'testpassword123',
    p_full_name: 'Test Inspector',
    p_semester: '7th Semester — Placement Season'
  });

  if (regErr) {
    console.error('Registration RPC Error:', regErr);
  } else {
    console.log('Registration RPC Success! Result:', regData);
  }

  console.log('\n3. Attempting to call login_user...');
  const { data: logData, error: logErr } = await supabase.rpc('login_user', {
    p_username: testUsername,
    p_password: 'testpassword123'
  });

  if (logErr) {
    console.error('Login RPC Error:', logErr);
  } else {
    console.log('Login RPC Success! Result:', logData);
  }

  // Clean up if inserted
  if (regData && regData.user && regData.user.id) {
    console.log('\n4. Cleaning up inserted user:', regData.user.id);
    const { data: delData, error: delErr } = await supabase
      .from('users')
      .delete()
      .eq('id', regData.user.id);
    if (delErr) {
      console.error('Error cleaning up:', delErr);
    } else {
      console.log('Cleanup success.');
    }
  }
}

run().catch(console.error);
