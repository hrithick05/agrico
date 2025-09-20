#!/usr/bin/env node

/**
 * Simple Database Setup Script for AgroConnect
 * This script will insert sample data directly
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

async function testConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Try to query a simple table to test connection
    const { data, error } = await supabase.from('equipment').select('*').limit(1);
    
    if (error) {
      console.log('❌ Connection test failed:', error.message);
      return false;
    } else {
      console.log('✅ Connection successful!');
      return true;
    }
  } catch (err) {
    console.log('❌ Connection test failed:', err.message);
    return false;
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
  console.log('🚀 Starting AgroConnect Database Test...');
  console.log(`📡 Connecting to: ${supabaseUrl}`);
  
  const connected = await testConnection();
  
  if (connected) {
    await insertSampleData();
  } else {
    console.log('❌ Cannot proceed without database connection');
    console.log('📝 Please create the tables manually in Supabase SQL Editor first');
  }
}

main();
