#!/usr/bin/env node

/**
 * Update Equipment Images Script
 * Updates existing equipment records with new agricultural equipment images
 */

const { createClient } = require('@supabase/supabase-js');

// Direct Supabase configuration
const supabaseUrl = 'https://ycorozkbfeqwybujwnaz.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inljb3JvemtiZmVxd3lidWp3bmF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzY2MTQ2MCwiZXhwIjoyMDczMjM3NDYwfQ.Uk8pYd76w-UEEzLmnXrTJEMdo86sB71iOA1vnQI8UoQ';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Direct image URLs converted from the provided links
const newImages = {
  // Tractor images - converted to direct Unsplash image URLs
  tractor1: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&h=300&fit=crop&auto=format',
  tractor2: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500&h=300&fit=crop&auto=format',
  
  // Rotary Tiller/Cultivator - using agricultural equipment image
  rotatoryTiller: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&h=300&fit=crop&auto=format',
  
  // Seed Drill Machine - using farming/seeding image
  seedDrill: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500&h=300&fit=crop&auto=format',
  
  // Sprayer Machine - using agricultural sprayer image
  sprayer: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&h=300&fit=crop&auto=format',
  
  // Agriculture/General farming - using general agriculture image
  agriculture: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500&h=300&fit=crop&auto=format',
  
  // Thresher/Harvester - using harvester image
  thresher: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&h=300&fit=crop&auto=format',
  
  // Plougher - using tractor/ploughing image
  plougher: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500&h=300&fit=crop&auto=format',
  
  // Irrigation Pump - using irrigation/farming image
  irrigationPump: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&h=300&fit=crop&auto=format'
};

async function updateEquipmentImages() {
  console.log('🖼️ Updating equipment images with new agricultural equipment photos...');
  
  try {
    // First, get all existing equipment
    const { data: equipment, error: fetchError } = await supabase
      .from('equipment')
      .select('*')
      .order('id');
    
    if (fetchError) {
      console.error('❌ Error fetching equipment:', fetchError.message);
      return;
    }
    
    console.log(`📊 Found ${equipment.length} equipment records to update`);
    
    // Map equipment to appropriate images based on type and name
    const imageUpdates = equipment.map((item, index) => {
      let imageUrl = '/placeholder.svg'; // default fallback
      
      // Map images based on equipment type and name
      if (item.type === 'Tractor') {
        if (item.name.includes('John Deere')) {
          imageUrl = newImages.tractor1;
        } else if (item.name.includes('Mahindra')) {
          imageUrl = newImages.tractor2;
        } else {
          imageUrl = newImages.tractor1; // default tractor image
        }
      } else if (item.type === 'Harvester' || item.name.includes('Harvester')) {
        imageUrl = newImages.thresher;
      } else if (item.type === 'Rotary Tiller' || item.name.includes('Rotavator')) {
        imageUrl = newImages.rotatoryTiller;
      } else if (item.type === 'Seed Drill' || item.name.includes('Seed Drill')) {
        imageUrl = newImages.seedDrill;
      } else if (item.type === 'Sprayer' || item.name.includes('Sprayer')) {
        imageUrl = newImages.sprayer;
      } else if (item.type === 'Cultivator' || item.name.includes('Cultivator')) {
        imageUrl = newImages.plougher;
      } else {
        // For other types, use agriculture image
        imageUrl = newImages.agriculture;
      }
      
      return {
        id: item.id,
        name: item.name,
        type: item.type,
        image_url: imageUrl
      };
    });
    
    // Update each equipment record with new image
    let successCount = 0;
    let errorCount = 0;
    
    for (const update of imageUpdates) {
      try {
        const { error: updateError } = await supabase
          .from('equipment')
          .update({ image_url: update.image_url })
          .eq('id', update.id);
        
        if (updateError) {
          console.error(`❌ Error updating ${update.name}:`, updateError.message);
          errorCount++;
        } else {
          console.log(`✅ Updated ${update.name} (${update.type}) with new image`);
          successCount++;
        }
      } catch (err) {
        console.error(`❌ Error updating ${update.name}:`, err.message);
        errorCount++;
      }
    }
    
    console.log(`\n📊 Update Summary:`);
    console.log(`✅ Successfully updated: ${successCount} equipment`);
    console.log(`❌ Failed updates: ${errorCount} equipment`);
    
  } catch (err) {
    console.error('❌ Error in update process:', err.message);
  }
}

async function verifyUpdates() {
  console.log('\n🔍 Verifying updated equipment images...');
  
  try {
    const { data: equipment, error } = await supabase
      .from('equipment')
      .select('id, name, type, image_url')
      .order('id');
    
    if (error) {
      console.error('❌ Error fetching equipment for verification:', error.message);
      return;
    }
    
    console.log('📋 Updated Equipment List:');
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
  console.log('🚀 Updating Equipment Images in AgroConnect...');
  console.log(`📡 Connecting to: ${supabaseUrl}`);
  
  await updateEquipmentImages();
  await verifyUpdates();
  
  console.log('🎉 Equipment image update completed!');
  console.log('🌐 Visit http://localhost:8080 to see the updated equipment page');
}

main();
