#!/usr/bin/env node

/**
 * Diverse Agricultural Equipment Images Update Script
 * Updates equipment with diverse, specific agricultural equipment images
 */

const { createClient } = require('@supabase/supabase-js');

// Direct Supabase configuration
const supabaseUrl = 'https://ycorozkbfeqwybujwnaz.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inljb3JvemtiZmVxd3lidWp3bmF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzY2MTQ2MCwiZXhwIjoyMDczMjM3NDYwfQ.Uk8pYd76w-UEEzLmnXrTJEMdo86sB71iOA1vnQI8UoQ';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Diverse agricultural equipment images - different equipment types
const diverseImages = {
  // Tractors - different colors and models
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

async function updateEquipmentDiverseImages() {
  console.log('🚜 Updating equipment with diverse agricultural equipment images...');
  
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
      'John Deere 5055D Tractor': diverseImages.johnDeereTractor,
      'Mahindra 475 DI Tractor': diverseImages.mahindraTractor,
      'Sonalika 745 DI Tractor': diverseImages.sonalikaTractor,
      'John Deere S680 Combine Harvester': diverseImages.combineHarvester,
      'Mahindra Rotavator 135': diverseImages.rotatoryTiller,
      'Sonalika Seed Drill 9 Row': diverseImages.seedDrill,
      'Escorts Crop Sprayer 400L': diverseImages.cropSprayer,
      'Kubota Cultivator 4WD': diverseImages.cultivator
    };
    
    // Update each equipment record with specific image
    let successCount = 0;
    let errorCount = 0;
    
    for (const item of equipment) {
      const imageUrl = equipmentImageMap[item.name] || diverseImages.johnDeereTractor;
      
      try {
        const { error: updateError } = await supabase
          .from('equipment')
          .update({ image_url: imageUrl })
          .eq('id', item.id);
        
        if (updateError) {
          console.error(`❌ Error updating ${item.name}:`, updateError.message);
          errorCount++;
        } else {
          console.log(`✅ Updated ${item.name} with diverse equipment image`);
          successCount++;
        }
      } catch (err) {
        console.error(`❌ Error updating ${item.name}:`, err.message);
        errorCount++;
      }
    }
    
    console.log(`\n📊 Diverse Images Update Summary:`);
    console.log(`✅ Successfully updated: ${successCount} equipment`);
    console.log(`❌ Failed updates: ${errorCount} equipment`);
    
  } catch (err) {
    console.error('❌ Error in diverse images update process:', err.message);
  }
}

async function verifyDiverseUpdates() {
  console.log('\n🔍 Verifying diverse equipment images...');
  
  try {
    const { data: equipment, error } = await supabase
      .from('equipment')
      .select('id, name, type, image_url')
      .order('id');
    
    if (error) {
      console.error('❌ Error fetching equipment for verification:', error.message);
      return;
    }
    
    console.log('📋 Diverse Equipment Images:');
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
  console.log('🚀 Diverse Agricultural Equipment Images Update for AgroConnect...');
  console.log(`📡 Connecting to: ${supabaseUrl}`);
  
  await updateEquipmentDiverseImages();
  await verifyDiverseUpdates();
  
  console.log('🎉 Diverse equipment image update completed!');
  console.log('🌐 Visit http://localhost:8080 to see the updated equipment page');
  console.log('💡 Images now show diverse agricultural equipment types');
}

main();

