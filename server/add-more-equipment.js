#!/usr/bin/env node

/**
 * Add More Equipment Script
 * Adds 5 more equipment cards with real images from Unsplash
 */

const { createClient } = require('@supabase/supabase-js');

// Direct Supabase configuration
const supabaseUrl = 'https://ycorozkbfeqwybujwnaz.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inljb3JvemtiZmVxd3lidWp3bmF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzY2MTQ2MCwiZXhwIjoyMDczMjM3NDYwfQ.Uk8pYd76w-UEEzLmnXrTJEMdo86sB71iOA1vnQI8UoQ';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addMoreEquipment() {
  console.log('🚜 Adding 5 more equipment cards with real images...');
  
  const additionalEquipment = [
    {
      name: 'John Deere S680 Combine Harvester',
      type: 'Harvester',
      owner: 'Modern Farms Ltd',
      location: 'Maharashtra, India',
      availability: 'Available',
      price: '₹45,00,000',
      original_price: '₹50,00,000',
      discount: '₹5,00,000 OFF',
      rating: 4.8,
      reviews: 89,
      features: ['450 HP Engine', 'Auto Guidance', 'GPS Navigation', 'Climate Control'],
      next_available: 'Available Now',
      image_url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&h=300&fit=crop',
      offer: 'Big Billion Days Price',
      sponsored: true
    },
    {
      name: 'Mahindra Rotavator 135',
      type: 'Rotary Tiller',
      owner: 'Green Earth Agriculture',
      location: 'Punjab, India',
      availability: 'Available',
      price: '₹1,25,000',
      original_price: '₹1,40,000',
      discount: '₹15,000 OFF',
      rating: 4.4,
      reviews: 156,
      features: ['135 HP Compatible', 'Heavy Duty Blades', 'Adjustable Depth', 'Easy Maintenance'],
      next_available: 'Available Now',
      image_url: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500&h=300&fit=crop',
      offer: 'Bestseller',
      sponsored: false
    },
    {
      name: 'Sonalika Seed Drill 9 Row',
      type: 'Seed Drill',
      owner: 'Progressive Seeds',
      location: 'Haryana, India',
      availability: 'Booked',
      price: '₹85,000',
      original_price: '₹95,000',
      discount: '₹10,000 OFF',
      rating: 4.2,
      reviews: 203,
      features: ['9 Row Configuration', 'Precision Seeding', 'Fertilizer Attachment', 'Depth Control'],
      next_available: 'Jan 10, 2025',
      image_url: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500&h=300&fit=crop',
      offer: 'Assured',
      sponsored: false
    },
    {
      name: 'Escorts Crop Sprayer 400L',
      type: 'Sprayer',
      owner: 'Crop Care Solutions',
      location: 'Rajasthan, India',
      availability: 'Available',
      price: '₹2,15,000',
      original_price: '₹2,35,000',
      discount: '₹20,000 OFF',
      rating: 4.6,
      reviews: 127,
      features: ['400L Tank Capacity', 'Boom Spray System', 'Pressure Control', 'Chemical Resistant'],
      next_available: 'Available Now',
      image_url: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500&h=300&fit=crop',
      offer: 'Big Billion Days Price',
      sponsored: true
    },
    {
      name: 'Kubota Cultivator 4WD',
      type: 'Cultivator',
      owner: 'Soil Masters',
      location: 'Karnataka, India',
      availability: 'Available',
      price: '₹1,85,000',
      original_price: '₹2,05,000',
      discount: '₹20,000 OFF',
      rating: 4.5,
      reviews: 178,
      features: ['4WD System', 'Hydraulic Lift', 'Adjustable Tines', 'Heavy Duty Frame'],
      next_available: 'Available Now',
      image_url: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500&h=300&fit=crop',
      offer: 'Bestseller',
      sponsored: false
    }
  ];

  try {
    const { error } = await supabase.from('equipment').insert(additionalEquipment);
    if (error) {
      console.error('❌ Error inserting additional equipment:', error.message);
    } else {
      console.log('✅ Successfully added 5 more equipment cards!');
      console.log('📊 Total equipment cards: 8');
    }
  } catch (err) {
    console.error('❌ Error inserting additional equipment:', err.message);
  }
}

async function testEquipmentCount() {
  console.log('🔍 Checking total equipment count...');
  
  try {
    const { data, error } = await supabase.from('equipment').select('*');
    
    if (error) {
      console.error('❌ Error fetching equipment:', error.message);
    } else {
      console.log(`✅ Total equipment in database: ${data.length}`);
      console.log('📋 Equipment list:');
      data.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name} - ${item.type} - ${item.availability}`);
      });
    }
  } catch (err) {
    console.error('❌ Error fetching equipment:', err.message);
  }
}

async function main() {
  console.log('🚀 Adding More Equipment to AgroConnect...');
  console.log(`📡 Connecting to: ${supabaseUrl}`);
  
  await addMoreEquipment();
  await testEquipmentCount();
  
  console.log('🎉 Equipment addition completed!');
  console.log('🌐 Visit http://localhost:8080 to see the updated equipment page');
}

main();
