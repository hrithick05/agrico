#!/usr/bin/env node

/**
 * Service Key Update Script
 * Replace the service key in config.js with the correct one
 */

const fs = require('fs');
const path = require('path');

// Read the current config file
const configPath = path.join(__dirname, 'config.js');
let configContent = fs.readFileSync(configPath, 'utf8');

console.log('🔑 Current service key in config.js:');
console.log('📝 Please replace the service key in the config.js file with your actual service key');
console.log('📍 File location:', configPath);
console.log('');

// Show the current key (first 50 characters for security)
const keyMatch = configContent.match(/serviceKey: '([^']+)'/);
if (keyMatch) {
  const currentKey = keyMatch[1];
  console.log('🔍 Current key (first 50 chars):', currentKey.substring(0, 50) + '...');
  console.log('');
  console.log('📋 To update:');
  console.log('1. Get your service key from Supabase dashboard');
  console.log('2. Replace the serviceKey value in config.js');
  console.log('3. Restart the server');
} else {
  console.log('❌ Could not find service key in config.js');
}

console.log('');
console.log('🎯 Your Supabase project URL: https://ycorozkbfeqwybujwnaz.supabase.co');
console.log('🔗 Dashboard: https://supabase.com/dashboard/project/ycorozkbfeqwybujwnaz');
console.log('📖 Go to Settings → API to get your service_role key');
