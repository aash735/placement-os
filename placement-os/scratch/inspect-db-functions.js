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
  console.log('Fetching details of register_user and login_user from information_schema / pg_proc...');
  
  // We can query pg_proc and pg_namespace through supabase.rpc if allowed, or raw select if we have rights.
  // Wait, let's see if we can do a query on a system table.
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .limit(1);
    
  if (error) {
    console.error('Error connecting:', error);
    return;
  }
  
  // Since we cannot run raw sql directly through standard postgrest without an RPC, 
  // let's see if we can execute a query or if there is a system view we can query.
  // Postgrest exposes views. Let's see if we can query pg_catalog.pg_proc?
  // Let's try:
  const { data: procData, error: procErr } = await supabase
    .from('pg_proc')
    .select('*')
    .limit(1);
    
  if (procErr) {
    console.log('Cannot query pg_proc directly via postgrest (expected due to permissions/not exposed):', procErr.message);
  } else {
    console.log('pg_proc accessible:', procData);
  }
  
  // Let's check what functions are defined in the schema by calling a test RPC that might tell us,
  // or let's try calling register_user with various parameter combinations to check for signature mismatches!
  // If we call with 4 arguments: p_username, p_password, p_full_name, p_semester:
  console.log('\n--- Testing register_user with 4 parameters ---');
  const res4 = await supabase.rpc('register_user', {
    p_username: 'test4_' + Date.now(),
    p_password: 'password',
    p_full_name: 'Test 4',
    p_semester: '7th Semester — Placement Season'
  });
  console.log('4-arg result:', res4);

  // If there was a mismatch, it would fail with a 404 or 400 (function not found/signature mismatch).
  // Let's see what happens if we call with different parameter names or count.
  console.log('\n--- Testing register_user with 3 parameters (missing semester) ---');
  const res3 = await supabase.rpc('register_user', {
    p_username: 'test3_' + Date.now(),
    p_password: 'password',
    p_full_name: 'Test 3'
  });
  console.log('3-arg result:', res3);
}

run().catch(console.error);
