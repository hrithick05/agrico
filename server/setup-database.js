#!/usr/bin/env node

/**
 * Database Setup Script for AgroConnect
 * This script will create all necessary tables and insert sample data
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://ycorozkbfeqwybujwnaz.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_KEY is required in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTables() {
  console.log('🏗️ Creating database tables...');
  
  const tables = [
    {
      name: 'equipment',
      sql: `
        CREATE TABLE IF NOT EXISTS equipment (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          type VARCHAR(100) NOT NULL,
          owner VARCHAR(255) NOT NULL,
          location VARCHAR(255) NOT NULL,
          availability VARCHAR(50) NOT NULL DEFAULT 'Available',
          price VARCHAR(50) NOT NULL,
          original_price VARCHAR(50),
          discount VARCHAR(50),
          rating DECIMAL(3,2) DEFAULT 0,
          reviews INTEGER DEFAULT 0,
          features TEXT[],
          next_available VARCHAR(100),
          image_url TEXT,
          offer VARCHAR(100),
          sponsored BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'bulk_deals',
      sql: `
        CREATE TABLE IF NOT EXISTS bulk_deals (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          min_quantity INTEGER NOT NULL,
          current_orders INTEGER DEFAULT 0,
          price_per_unit DECIMAL(10,2) NOT NULL,
          original_price DECIMAL(10,2),
          savings DECIMAL(10,2),
          deadline DATE,
          category VARCHAR(100),
          status VARCHAR(50) DEFAULT 'Active',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'forum_posts',
      sql: `
        CREATE TABLE IF NOT EXISTS forum_posts (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          author VARCHAR(255) NOT NULL,
          category VARCHAR(100),
          likes INTEGER DEFAULT 0,
          replies INTEGER DEFAULT 0,
          time_ago VARCHAR(50),
          has_voice_note BOOLEAN DEFAULT FALSE,
          language VARCHAR(50) DEFAULT 'English',
          tags TEXT[],
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'lending_circles',
      sql: `
        CREATE TABLE IF NOT EXISTS lending_circles (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          total_members INTEGER DEFAULT 0,
          max_members INTEGER NOT NULL,
          interest_rate DECIMAL(5,2) NOT NULL,
          loan_range VARCHAR(100) NOT NULL,
          status VARCHAR(50) DEFAULT 'Active',
          member_contribution DECIMAL(10,2) NOT NULL,
          trust_score DECIMAL(3,2) DEFAULT 0,
          completed_loans INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'loans',
      sql: `
        CREATE TABLE IF NOT EXISTS loans (
          id SERIAL PRIMARY KEY,
          amount DECIMAL(10,2) NOT NULL,
          purpose VARCHAR(255) NOT NULL,
          status VARCHAR(50) DEFAULT 'Pending',
          approved_date DATE,
          applied_date DATE DEFAULT CURRENT_DATE,
          due_date DATE,
          repaid_date DATE,
          monthly_emi DECIMAL(10,2),
          circle VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'expenses',
      sql: `
        CREATE TABLE IF NOT EXISTS expenses (
          id SERIAL PRIMARY KEY,
          date DATE NOT NULL,
          category VARCHAR(100) NOT NULL,
          description TEXT,
          amount DECIMAL(10,2) NOT NULL,
          type VARCHAR(50) DEFAULT 'Expense',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'market_trends',
      sql: `
        CREATE TABLE IF NOT EXISTS market_trends (
          id SERIAL PRIMARY KEY,
          crop VARCHAR(100) NOT NULL,
          current_price VARCHAR(50) NOT NULL,
          change VARCHAR(50),
          change_percent VARCHAR(50),
          trend VARCHAR(50) NOT NULL,
          prediction TEXT,
          best_sell_time VARCHAR(100),
          confidence DECIMAL(3,2) DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'market_alerts',
      sql: `
        CREATE TABLE IF NOT EXISTS market_alerts (
          id SERIAL PRIMARY KEY,
          type VARCHAR(100) NOT NULL,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          action VARCHAR(255),
          priority VARCHAR(50) DEFAULT 'Medium',
          time_left VARCHAR(100),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'optimization_suggestions',
      sql: `
        CREATE TABLE IF NOT EXISTS optimization_suggestions (
          id SERIAL PRIMARY KEY,
          category VARCHAR(100) NOT NULL,
          title VARCHAR(255) NOT NULL,
          impact VARCHAR(100),
          description TEXT NOT NULL,
          confidence DECIMAL(3,2) DEFAULT 0,
          time_to_implement VARCHAR(100),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'government_schemes',
      sql: `
        CREATE TABLE IF NOT EXISTS government_schemes (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          category VARCHAR(100),
          amount VARCHAR(100),
          eligibility TEXT,
          application_deadline DATE,
          status VARCHAR(50) DEFAULT 'Active',
          color VARCHAR(50),
          documents TEXT[],
          benefits TEXT[],
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'common_phrases',
      sql: `
        CREATE TABLE IF NOT EXISTS common_phrases (
          id SERIAL PRIMARY KEY,
          en VARCHAR(255) NOT NULL,
          hi VARCHAR(255) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    }
  ];

  for (const table of tables) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: table.sql });
      if (error) {
        console.error(`❌ Error creating table ${table.name}:`, error.message);
      } else {
        console.log(`✅ Created table: ${table.name}`);
      }
    } catch (err) {
      console.error(`❌ Error creating table ${table.name}:`, err.message);
    }
  }
}

async function insertSampleData() {
  console.log('📊 Inserting sample data...');
  
  // Equipment data
  const equipmentData = [
    {
      name: 'John Deere 5055D Tractor',
      type: 'Tractor',
      owner: 'Rajesh Kumar',
      location: 'Punjab, India',
      availability: 'Available',
      price: '₹8,50,000',
      original_price: '₹9,00,000',
      discount: '₹50,000 OFF',
      rating: 4.5,
      reviews: 127,
      features: ['45 HP Engine', '4WD', 'Power Steering'],
      next_available: 'Available Now',
      image_url: '/placeholder.svg',
      offer: 'Big Billion Days Price',
      sponsored: true
    },
    {
      name: 'Mahindra 475 DI Tractor',
      type: 'Tractor',
      owner: 'Singh Farms',
      location: 'Haryana, India',
      availability: 'Available',
      price: '₹6,75,000',
      original_price: '₹7,25,000',
      discount: '₹50,000 OFF',
      rating: 4.3,
      reviews: 89,
      features: ['47 HP Engine', '2WD', 'Power Steering'],
      next_available: 'Available Now',
      image_url: '/placeholder.svg',
      offer: 'Bestseller',
      sponsored: false
    },
    {
      name: 'Sonalika 745 DI Tractor',
      type: 'Tractor',
      owner: 'Green Valley Farms',
      location: 'Rajasthan, India',
      availability: 'Booked',
      price: '₹5,95,000',
      original_price: '₹6,45,000',
      discount: '₹50,000 OFF',
      rating: 4.2,
      reviews: 156,
      features: ['45 HP Engine', '2WD', 'Power Steering'],
      next_available: 'Dec 15, 2024',
      image_url: '/placeholder.svg',
      offer: 'Assured',
      sponsored: false
    }
  ];

  try {
    const { error } = await supabase.from('equipment').insert(equipmentData);
    if (error) {
      console.error('❌ Error inserting equipment data:', error.message);
    } else {
      console.log('✅ Inserted equipment data');
    }
  } catch (err) {
    console.error('❌ Error inserting equipment data:', err.message);
  }
}

async function main() {
  console.log('🚀 Starting AgroConnect Database Setup...');
  console.log(`📡 Connecting to: ${supabaseUrl}`);
  
  try {
    await createTables();
    await insertSampleData();
    console.log('🎉 Database setup completed successfully!');
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
  }
}

main();
