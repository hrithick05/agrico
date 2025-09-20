#!/usr/bin/env node

/**
 * Supabase Installation Script for AgroConnect
 * This script helps set up Supabase integration
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Supabase for AgroConnect...\n');

// Check if package.json exists
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ package.json not found. Please run this script from your project root.');
  process.exit(1);
}

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Check if Supabase is already installed
if (packageJson.dependencies && packageJson.dependencies['@supabase/supabase-js']) {
  console.log('✅ Supabase client is already installed');
} else {
  console.log('📦 Installing Supabase client...');
  console.log('   Run: npm install @supabase/supabase-js');
}

// Create .env.local template
const envTemplate = `# Supabase Configuration
# Replace with your actual Supabase project credentials

VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# To get these values:
# 1. Go to your Supabase dashboard
# 2. Navigate to Settings > API
# 3. Copy your Project URL and anon public key
`;

const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ Created .env.local template');
} else {
  console.log('⚠️  .env.local already exists - please update it with your Supabase credentials');
}

// Check if database files exist
const schemaPath = path.join(process.cwd(), 'database_schema.sql');
const dataPath = path.join(process.cwd(), 'database_data.sql');

if (fs.existsSync(schemaPath) && fs.existsSync(dataPath)) {
  console.log('✅ Database schema and data files found');
} else {
  console.log('❌ Database files not found. Please ensure database_schema.sql and database_data.sql are in your project root.');
}

console.log('\n📋 Next Steps:');
console.log('1. Install Supabase client: npm install @supabase/supabase-js');
console.log('2. Update .env.local with your Supabase credentials');
console.log('3. Run the SQL scripts in your Supabase SQL editor:');
console.log('   - database_schema.sql (creates tables)');
console.log('   - database_data.sql (inserts sample data)');
console.log('4. Start your development server: npm run dev');
console.log('\n📖 For detailed instructions, see SUPABASE_SETUP.md');
console.log('\n🎉 Setup complete! Happy coding!');
