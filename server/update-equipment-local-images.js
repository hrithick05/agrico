#!/usr/bin/env node

/**
 * Update Equipment with Local Images Script
 * Updates equipment with images from the local img folder
 */

const { createClient } = require('@supabase/supabase-js');

// Direct Supabase configuration
const supabaseUrl = 'https://ycorozkbfeqwybujwnaz.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inljb3JvemtiZmVxd3lidWp3bmF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzY2MTQ2MCwiZXhwIjoyMDczMjM3NDYwfQ.Uk8pYd76w-UEEzLmnXrTJEMdo86sB71iOA1vnQI8UoQ';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Local images from public/img folder
const localImages = {
  // Tractors
  tractor: '/img/tractor.jpg',
  
  // Harvesters
  harvester: '/img/harvester.jpg',
  thresher: '/img/thrusher.jpg', // Note: using thrusher.jpg for thresher
  
  // Soil preparation equipment
  tiller: '/img/tiller.jpg',
  cultivator: '/img/cultivator.jpg',
  plough: '/img/plough.jpg',
  
  // Seeding equipment
  seedDrill: '/img/seed driller.jpg',
  
  // Spraying equipment
  sprayer: '/img/sprayer.jpg',
  
  // Irrigation equipment
  irrigationPump: '/img/irrigationpump.jpg'
};

async function updateEquipmentWithLocalImages() {
  console.log('🚜 Updating equipment with local images from img folder...');
  
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
      'John Deere 5055D Tractor': localImages.tractor,
      'Mahindra 475 DI Tractor': localImages.tractor,
      'Sonalika 745 DI Tractor': localImages.tractor,
      'John Deere S680 Combine Harvester': localImages.harvester,
      'Mahindra Rotavator 135': localImages.tiller,
      'Sonalika Seed Drill 9 Row': localImages.seedDrill,
      'Escorts Crop Sprayer 400L': localImages.sprayer,
      'Kubota Cultivator 4WD': localImages.cultivator
    };
    
    // Update each equipment record with local image
    let successCount = 0;
    let errorCount = 0;
    
    for (const item of equipment) {
      const imageUrl = equipmentImageMap[item.name] || localImages.tractor;
      
      try {
        const { error: updateError } = await supabase
          .from('equipment')
          .update({ image_url: imageUrl })
          .eq('id', item.id);
        
        if (updateError) {
          console.error(`❌ Error updating ${item.name}:`, updateError.message);
          errorCount++;
        } else {
          console.log(`✅ Updated ${item.name} with local image: ${imageUrl}`);
          successCount++;
        }
      } catch (err) {
        console.error(`❌ Error updating ${item.name}:`, err.message);
        errorCount++;
      }
    }
    
    console.log(`\n📊 Local Images Update Summary:`);
    console.log(`✅ Successfully updated: ${successCount} equipment`);
    console.log(`❌ Failed updates: ${errorCount} equipment`);
    
  } catch (err) {
    console.error('❌ Error in local images update process:', err.message);
  }
}

async function verifyLocalImageUpdates() {
  console.log('\n🔍 Verifying local image updates...');
  
  try {
    const { data: equipment, error } = await supabase
      .from('equipment')
      .select('id, name, type, image_url')
      .order('id');
    
    if (error) {
      console.error('❌ Error fetching equipment for verification:', error.message);
      return;
    }
    
    console.log('📋 Equipment with Local Images:');
    equipment.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} (${item.type})`);
      console.log(`   Local Image: ${item.image_url}`);
      console.log('');
    });
    
  } catch (err) {
    console.error('❌ Error in verification:', err.message);
  }
}

async function main() {
  console.log('🚀 Local Images Update for AgroConnect Equipment...');
  console.log(`📡 Connecting to: ${supabaseUrl}`);
  
  await updateEquipmentWithLocalImages();
  await verifyLocalImageUpdates();
  
  console.log('🎉 Local images update completed!');
  console.log('🌐 Visit http://localhost:8080 to see the updated equipment with local images');
  console.log('💡 All equipment now uses images from your local img folder');
}

main();

