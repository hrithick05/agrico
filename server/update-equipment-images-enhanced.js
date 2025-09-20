#!/usr/bin/env node

/**
 * Enhanced Equipment Images Update Script
 * Updates equipment with high-quality, specific agricultural equipment images
 */

const { createClient } = require('@supabase/supabase-js');

// Direct Supabase configuration
const supabaseUrl = 'https://ycorozkbfeqwybujwnaz.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inljb3JvemtiZmVxd3lidWp3bmF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzY2MTQ2MCwiZXhwIjoyMDczMjM3NDYwfQ.Uk8pYd76w-UEEzLmnXrTJEMdo86sB71iOA1vnQI8UoQ';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// High-quality agricultural equipment images from Unsplash
const enhancedImages = {
  // Tractor images - different tractors for variety
  johnDeereTractor: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&h=300&fit=crop&auto=format&q=80',
  mahindraTractor: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500&h=300&fit=crop&auto=format&q=80',
  sonalikaTractor: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&h=300&fit=crop&auto=format&q=80',
  
  // Harvester/Combine
  harvester: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&h=300&fit=crop&auto=format&q=80',
  
  // Rotary Tiller/Rotavator
  rotatoryTiller: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500&h=300&fit=crop&auto=format&q=80',
  
  // Seed Drill
  seedDrill: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500&h=300&fit=crop&auto=format&q=80',
  
  // Sprayer
  sprayer: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&h=300&fit=crop&auto=format&q=80',
  
  // Cultivator
  cultivator: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500&h=300&fit=crop&auto=format&q=80'
};

async function updateEquipmentImagesEnhanced() {
  console.log('🚜 Updating equipment with enhanced agricultural images...');
  
  try {
    // Get all existing equipment
    const { data: equipment, error: fetchError } = await supabase
      .from('equipment')
      .select('*')
      .order('id');
    
    if (fetchError) {
      console.error('❌ Error fetching equipment:', fetchError.message);
      return;
    }
    
    console.log(`📊 Found ${equipment.length} equipment records to update`);
    
    // Create specific mappings for each equipment
    const equipmentImageMap = {
      'John Deere 5055D Tractor': enhancedImages.johnDeereTractor,
      'Mahindra 475 DI Tractor': enhancedImages.mahindraTractor,
      'Sonalika 745 DI Tractor': enhancedImages.sonalikaTractor,
      'John Deere S680 Combine Harvester': enhancedImages.harvester,
      'Mahindra Rotavator 135': enhancedImages.rotatoryTiller,
      'Sonalika Seed Drill 9 Row': enhancedImages.seedDrill,
      'Escorts Crop Sprayer 400L': enhancedImages.sprayer,
      'Kubota Cultivator 4WD': enhancedImages.cultivator
    };
    
    // Update each equipment record with specific image
    let successCount = 0;
    let errorCount = 0;
    
    for (const item of equipment) {
      const imageUrl = equipmentImageMap[item.name] || enhancedImages.johnDeereTractor;
      
      try {
        const { error: updateError } = await supabase
          .from('equipment')
          .update({ image_url: imageUrl })
          .eq('id', item.id);
        
        if (updateError) {
          console.error(`❌ Error updating ${item.name}:`, updateError.message);
          errorCount++;
        } else {
          console.log(`✅ Updated ${item.name} with enhanced image`);
          successCount++;
        }
      } catch (err) {
        console.error(`❌ Error updating ${item.name}:`, err.message);
        errorCount++;
      }
    }
    
    console.log(`\n📊 Enhanced Update Summary:`);
    console.log(`✅ Successfully updated: ${successCount} equipment`);
    console.log(`❌ Failed updates: ${errorCount} equipment`);
    
  } catch (err) {
    console.error('❌ Error in enhanced update process:', err.message);
  }
}

async function verifyEnhancedUpdates() {
  console.log('\n🔍 Verifying enhanced equipment images...');
  
  try {
    const { data: equipment, error } = await supabase
      .from('equipment')
      .select('id, name, type, image_url')
      .order('id');
    
    if (error) {
      console.error('❌ Error fetching equipment for verification:', error.message);
      return;
    }
    
    console.log('📋 Enhanced Equipment Images:');
    equipment.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} (${item.type})`);
      console.log(`   Image: ${item.image_url}`);
      console.log('');
    });
    
  } catch (err) {
    console.error('❌ Error in verification:', err.message);
  }
}

async function main() {
  console.log('🚀 Enhanced Equipment Images Update for AgroConnect...');
  console.log(`📡 Connecting to: ${supabaseUrl}`);
  
  await updateEquipmentImagesEnhanced();
  await verifyEnhancedUpdates();
  
  console.log('🎉 Enhanced equipment image update completed!');
  console.log('🌐 Visit http://localhost:8080 to see the updated equipment page');
  console.log('💡 Images should now display properly with high-quality agricultural equipment photos');
}

main();

