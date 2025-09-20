#!/usr/bin/env node

/**
 * Direct Database Setup Script for AgroConnect
 * No environment variables needed - all values are hardcoded
 */

const { createClient } = require('@supabase/supabase-js');

// Direct Supabase configuration
const supabaseUrl = 'https://ycorozkbfeqwybujwnaz.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inljb3JvemtiZmVxd3lidWp3bmF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzY2MTQ2MCwiZXhwIjoyMDczMjM3NDYwfQ.Uk8pYd76w-UEEzLmnXrTJEMdo86sB71iOA1vnQI8UoQ';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createEquipmentTable() {
  console.log('🏗️ Creating equipment table...');
  
  // First, let's try to create the table using a direct SQL approach
  const createTableSQL = `
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
  `;

  try {
    // Try using the REST API to execute SQL
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({ sql: createTableSQL })
    });

    if (response.ok) {
      console.log('✅ Equipment table created successfully!');
      return true;
    } else {
      console.log('❌ Failed to create table via REST API');
      return false;
    }
  } catch (error) {
    console.log('❌ Error creating table:', error.message);
    return false;
  }
}

async function insertSampleData() {
  console.log('📊 Inserting sample equipment data...');
  
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
      console.log('✅ Inserted equipment data successfully!');
    }
  } catch (err) {
    console.error('❌ Error inserting equipment data:', err.message);
  }
}

async function testConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    const { data, error } = await supabase.from('equipment').select('*').limit(1);
    
    if (error) {
      console.log('❌ Connection test failed:', error.message);
      return false;
    } else {
      console.log('✅ Connection successful!');
      console.log('📊 Found', data.length, 'equipment records');
      return true;
    }
  } catch (err) {
    console.log('❌ Connection test failed:', err.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting AgroConnect Database Setup...');
  console.log(`📡 Connecting to: ${supabaseUrl}`);
  
  // Test connection first
  const connected = await testConnection();
  
  if (!connected) {
    console.log('🏗️ Table does not exist, attempting to create...');
    const created = await createEquipmentTable();
    
    if (created) {
      console.log('📊 Inserting sample data...');
      await insertSampleData();
    } else {
      console.log('❌ Could not create table programmatically');
      console.log('📝 Please create the table manually in Supabase SQL Editor');
    }
  } else {
    console.log('✅ Database is ready!');
  }
}

main();
