// Standalone Supabase Connection Diagnostic Script (Native HTTP Fetch)
import fs from 'fs';
import path from 'path';

console.log('\n=========================================');
console.log('   🔍 SUPABASE CONNECTION DIAGNOSTIC');
console.log('=========================================\n');

// Read .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = trimmed.replace('NEXT_PUBLIC_SUPABASE_URL=', '').trim();
    }
    if (trimmed.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
      supabaseAnonKey = trimmed.replace('NEXT_PUBLIC_SUPABASE_ANON_KEY=', '').trim();
    }
  });
}

console.log(`Configured Project URL: ${supabaseUrl || '(empty)'}`);
console.log(`Configured Anon Key:    ${supabaseAnonKey ? supabaseAnonKey.substring(0, 15) + '...' : '(empty)'}\n`);

if (
  !supabaseUrl ||
  !supabaseAnonKey ||
  supabaseUrl.includes('your-project') ||
  supabaseAnonKey.includes('your-anon-key')
) {
  console.log('🔴 STATUS: Supabase is NOT CONNECTED.');
  console.log('👉 Reason: habit-tracker/.env.local contains default placeholder values.\n');
  console.log('-----------------------------------------');
  console.log('📌 HOW TO CONNECT:');
  console.log('1. Go to https://supabase.com/dashboard and select your project.');
  console.log('2. Click on "Project Settings" (gear icon) -> "API".');
  console.log('3. Copy your "Project URL" and "anon public" API key.');
  console.log('4. Open habit-tracker/.env.local and replace the placeholders.');
  console.log('5. Open your Supabase SQL Editor and execute:');
  console.log('   - supabase/schema.sql (creates all tables & security rules)');
  console.log('   - supabase/seed.sql   (populates initial data)');
  console.log('-----------------------------------------\n');
  process.exit(1);
}

try {
  console.log('📡 Pinging Supabase REST API...');
  const res = await fetch(`${supabaseUrl}/rest/v1/profiles?select=id,full_name&limit=1`, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
  });

  if (res.ok) {
    const data = await res.json();
    console.log('🟢 STATUS: Supabase is CONNECTED successfully!');
    console.log(`✅ HTTP Status: ${res.status} OK`);
    console.log(`📊 "profiles" table detected with ${data.length} sample record(s).`);
    console.log('\n🎉 Your database is fully configured and ready for live sync!\n');
    process.exit(0);
  } else {
    const errorText = await res.text();
    if (res.status === 404 || errorText.includes('relation "public.profiles" does not exist')) {
      console.log('🟡 STATUS: Connected to Supabase, but schema tables are MISSING.');
      console.log('👉 Fix: Go to your Supabase Dashboard -> SQL Editor, copy supabase/schema.sql and click Run.\n');
    } else {
      console.log(`🔴 STATUS: Connection rejected (HTTP ${res.status}).`);
      console.log(`Response: ${errorText}\n`);
    }
    process.exit(1);
  }
} catch (err) {
  console.log('🔴 STATUS: Network error while reaching Supabase URL.');
  console.log('Details:', err.message, '\n');
  process.exit(1);
}
