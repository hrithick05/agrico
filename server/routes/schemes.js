const express = require('express');
const supabase = require('../supabase');
const router = express.Router();

// Get all government schemes
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('government_schemes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching government schemes:', error);
    res.status(500).json({ error: 'Failed to fetch government schemes' });
  }
});

// Get schemes by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { data, error } = await supabase
      .from('government_schemes')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching schemes by category:', error);
    res.status(500).json({ error: 'Failed to fetch schemes by category' });
  }
});

// Get active schemes
router.get('/active', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('government_schemes')
      .select('*')
      .eq('status', 'Active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching active schemes:', error);
    res.status(500).json({ error: 'Failed to fetch active schemes' });
  }
});

// Search schemes
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const { data, error } = await supabase
      .from('government_schemes')
      .select('*')
      .or(`title.ilike.%${q}%,description.ilike.%${q}%,category.ilike.%${q}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error searching schemes:', error);
    res.status(500).json({ error: 'Failed to search schemes' });
  }
});

// Add new scheme
router.post('/', async (req, res) => {
  try {
    const schemeData = req.body;
    
    const { data, error } = await supabase
      .from('government_schemes')
      .insert([schemeData])
      .select();

    if (error) throw error;
    res.status(201).json({ 
      message: 'Government scheme added successfully', 
      scheme: data[0] 
    });
  } catch (error) {
    console.error('Error adding government scheme:', error);
    res.status(500).json({ error: 'Failed to add government scheme' });
  }
});

module.exports = router;
