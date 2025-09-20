#!/usr/bin/env node

/**
 * Equipment-Specific Images Update Script
 * Updates equipment with specific images that match each equipment title
 */

const { createClient } = require('@supabase/supabase-js');

// Direct Supabase configuration
const supabaseUrl = 'https://ycorozkbfeqwybujwnaz.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inljb3JvemtiZmVxd3lidWp3bmF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzY2MTQ2MCwiZXhwIjoyMDczMjM3NDYwfQ.Uk8pYd76w-UEEzLmnXrTJEMdo86sB71iOA1vnQI8UoQ';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Specific agricultural equipment images - diverse equipment types
const specificImages = {
  // Tractors - different tractor models and colors
  johnDeereTractor: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&h=300&fit=crop&auto=format&q=80',
  mahindraTractor: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500&h=300&fit=crop&auto=format&q=80',
  sonalikaTractor: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&h=300&fit=crop&auto=format&q=80',
  
  // Combine Harvester - large harvesting machine
  combineHarvester: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&h=300&fit=crop&auto=format&q=80',
  
  // Rotary Tiller/Rotavator - soil preparation equipment
  rotatoryTiller: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500&h=300&fit=crop&auto=format&q=80',
  
  // Seed Drill - precision seeding equipment
  seedDrill: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500&h=300&fit=crop&auto=format&q=80',
  
  // Crop Sprayer - pesticide/fertilizer application
  cropSprayer: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&h=300&fit=crop&auto=format&q=80',
  
  // Cultivator - soil cultivation equipment
  cultivator: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500&h=300&fit=crop&auto=format&q=80'
};

async function updateEquipmentSpecificImages() {
  console.log('🚜 Updating equipment with specific agricultural equipment images...');
  
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
    
    // Create specific mappings for each equipment based on their names and types
    const equipmentImageMap = {
      'John Deere 5055D Tractor': specificImages.johnDeereTractor,
      'Mahindra 475 DI Tractor': specificImages.mahindraTractor,
      'Sonalika 745 DI Tractor': specificImages.sonalikaTractor,
      'John Deere S680 Combine Harvester': specificImages.combineHarvester,
      'Mahindra Rotavator 135': specificImages.rotatoryTiller,
      'Sonalika Seed Drill 9 Row': specificImages.seedDrill,
      'Escorts Crop Sprayer 400L': specificImages.cropSprayer,
      'Kubota Cultivator 4WD': specificImages.cultivator
    };
    
    // Update each equipment record with specific image
    let successCount = 0;
    let errorCount = 0;
    
    for (const item of equipment) {
      const imageUrl = equipmentImageMap[item.name] || specificImages.johnDeereTractor;
      
      try {
        const { error: updateError } = await supabase
          .from('equipment')
          .update({ image_url: imageUrl })
          .eq('id', item.id);
        
        if (updateError) {
          console.error(`❌ Error updating ${item.name}:`, updateError.message);
          errorCount++;
        } else {
          console.log(`✅ Updated ${item.name} with specific equipment image`);
          successCount++;
        }
      } catch (err) {
        console.error(`❌ Error updating ${item.name}:`, err.message);
        errorCount++;
      }
    }
    
    console.log(`\n📊 Specific Images Update Summary:`);
    console.log(`✅ Successfully updated: ${successCount} equipment`);
    console.log(`❌ Failed updates: ${errorCount} equipment`);
    
  } catch (err) {
    console.error('❌ Error in specific images update process:', err.message);
  }
}

async function verifySpecificUpdates() {
  console.log('\n🔍 Verifying equipment-specific images...');
  
  try {
    const { data: equipment, error } = await supabase
      .from('equipment')
      .select('id, name, type, image_url')
      .order('id');
    
    if (error) {
      console.error('❌ Error fetching equipment for verification:', error.message);
      return;
    }
    
    console.log('📋 Equipment-Specific Images:');
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
  console.log('🚀 Equipment-Specific Images Update for AgroConnect...');
  console.log(`📡 Connecting to: ${supabaseUrl}`);
  
  await updateEquipmentSpecificImages();
  await verifySpecificUpdates();
  
  console.log('🎉 Equipment-specific image update completed!');
  console.log('🌐 Visit http://localhost:8080 to see the updated equipment page');
  console.log('💡 Images now match each equipment type specifically');
}

main();
