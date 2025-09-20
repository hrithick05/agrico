const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const supabase = require('../supabase');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/equipment');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'equipment-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Get all equipment
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('equipment')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching equipment:', error);
    res.status(500).json({ error: 'Failed to fetch equipment' });
  }
});

// Get equipment by type
router.get('/type/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { data, error } = await supabase
      .from('equipment')
      .select('*')
      .eq('type', type)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching equipment by type:', error);
    res.status(500).json({ error: 'Failed to fetch equipment by type' });
  }
});

// Get available equipment
router.get('/available', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('equipment')
      .select('*')
      .eq('availability', 'Available')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching available equipment:', error);
    res.status(500).json({ error: 'Failed to fetch available equipment' });
  }
});

// Search equipment
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const { data, error } = await supabase
      .from('equipment')
      .select('*')
      .or(`name.ilike.%${q}%,type.ilike.%${q}%,location.ilike.%${q}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error searching equipment:', error);
    res.status(500).json({ error: 'Failed to search equipment' });
  }
});

// Book equipment
router.patch('/:id/book', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('equipment')
      .update({ 
        availability: 'Booked', 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    
    if (data.length === 0) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    res.json({ 
      message: 'Equipment booked successfully', 
      equipment: data[0] 
    });
  } catch (error) {
    console.error('Error booking equipment:', error);
    res.status(500).json({ error: 'Failed to book equipment' });
  }
});

// Add new equipment with file upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const equipmentData = { ...req.body };
    
    // Parse features if it's a string
    if (equipmentData.features && typeof equipmentData.features === 'string') {
      equipmentData.features = JSON.parse(equipmentData.features);
    }
    
    // Convert rating and reviews to numbers
    if (equipmentData.rating) {
      equipmentData.rating = parseFloat(equipmentData.rating);
    }
    if (equipmentData.reviews) {
      equipmentData.reviews = parseInt(equipmentData.reviews);
    }
    
    // Convert sponsored to boolean
    if (equipmentData.sponsored) {
      equipmentData.sponsored = equipmentData.sponsored === 'true';
    }
    
    // Handle image upload
    if (req.file) {
      // For now, store the local file path
      // In production, you might want to upload to cloud storage
      equipmentData.image_url = `/uploads/equipment/${req.file.filename}`;
    } else {
      // Use default image if no image uploaded
      equipmentData.image_url = '/placeholder.svg';
    }
    
    // Set timestamps
    const now = new Date().toISOString();
    equipmentData.created_at = now;
    equipmentData.updated_at = now;
    
    const { data, error } = await supabase
      .from('equipment')
      .insert([equipmentData])
      .select();

    if (error) throw error;
    
    res.status(201).json({ 
      message: 'Equipment added successfully', 
      equipment: data[0] 
    });
  } catch (error) {
    console.error('Error adding equipment:', error);
    
    // Clean up uploaded file if there was an error
    if (req.file) {
      const filePath = path.join(__dirname, '../uploads/equipment', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    res.status(500).json({ error: 'Failed to add equipment' });
  }
});

// Update equipment
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    updateData.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('equipment')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) throw error;
    
    if (data.length === 0) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    res.json({ 
      message: 'Equipment updated successfully', 
      equipment: data[0] 
    });
  } catch (error) {
    console.error('Error updating equipment:', error);
    res.status(500).json({ error: 'Failed to update equipment' });
  }
});

// Delete equipment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('equipment')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    console.error('Error deleting equipment:', error);
    res.status(500).json({ error: 'Failed to delete equipment' });
  }
});

module.exports = router;
