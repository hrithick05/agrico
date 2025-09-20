#!/usr/bin/env node

/**
 * Update Tractor Images Script
 * Updates tractor equipment with a new, better tractor image
 */

const { createClient } = require('@supabase/supabase-js');

// Direct Supabase configuration
const supabaseUrl = 'https://ycorozkbfeqwybujwnaz.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inljb3JvemtiZmVxd3lidWp3bmF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzY2MTQ2MCwiZXhwIjoyMDczMjM3NDYwfQ.Uk8pYd76w-UEEzLmnXrTJEMdo86sB71iOA1vnQI8UoQ';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// New tractor image - different from current ones
const newTractorImage = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&h=300&fit=crop&auto=format&q=80';

async function updateTractorImages() {
  console.log('🚜 Updating tractor images with new tractor photo...');
  
  try {
    // Get all tractor equipment
    const { data: equipment, error: fetchError } = await supabase
      .from('equipment')
      .select('*')
      .eq('type', 'Tractor')
      .order('id');
    
    if (fetchError) {
      console.error('❌ Error fetching tractor equipment:', fetchError.message);
      return;
    }
    
    console.log(`📊 Found ${equipment.length} tractor records to update`);
    
    // Update each tractor record with new image
    let successCount = 0;
    let errorCount = 0;
    
    for (const item of equipment) {
      try {
        const { error: updateError } = await supabase
          .from('equipment')
          .update({ image_url: newTractorImage })
          .eq('id', item.id);
        
        if (updateError) {
          console.error(`❌ Error updating ${item.name}:`, updateError.message);
          errorCount++;
        } else {
          console.log(`✅ Updated ${item.name} with new tractor image`);
          successCount++;
        }
      } catch (err) {
        console.error(`❌ Error updating ${item.name}:`, err.message);
        errorCount++;
      }
    }
    
    console.log(`\n📊 Tractor Images Update Summary:`);
    console.log(`✅ Successfully updated: ${successCount} tractors`);
    console.log(`❌ Failed updates: ${errorCount} tractors`);
    
  } catch (err) {
    console.error('❌ Error in tractor images update process:', err.message);
  }
}

async function verifyTractorUpdates() {
  console.log('\n🔍 Verifying updated tractor images...');
  
  try {
    const { data: equipment, error } = await supabase
      .from('equipment')
      .select('id, name, type, image_url')
      .eq('type', 'Tractor')
      .order('id');
    
    if (error) {
      console.error('❌ Error fetching tractor equipment for verification:', error.message);
      return;
    }
    
    console.log('📋 Updated Tractor Images:');
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
  console.log('🚀 Tractor Images Update for AgroConnect...');
  console.log(`📡 Connecting to: ${supabaseUrl}`);
  
  await updateTractorImages();
  await verifyTractorUpdates();
  
  console.log('🎉 Tractor image update completed!');
  console.log('🌐 Visit http://localhost:8080 to see the updated tractor images');
}

main();

