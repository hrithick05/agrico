const express = require('express');
const supabase = require('../supabase');
const router = express.Router();

// Get market trends
router.get('/trends', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('market_trends')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching market trends:', error);
    res.status(500).json({ error: 'Failed to fetch market trends' });
  }
});

// Get market alerts
router.get('/alerts', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('market_alerts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching market alerts:', error);
    res.status(500).json({ error: 'Failed to fetch market alerts' });
  }
});

// Get optimization suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('optimization_suggestions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching optimization suggestions:', error);
    res.status(500).json({ error: 'Failed to fetch optimization suggestions' });
  }
});

// Add new market trend
router.post('/trends', async (req, res) => {
  try {
    const trendData = req.body;
    
    const { data, error } = await supabase
      .from('market_trends')
      .insert([trendData])
      .select();

    if (error) throw error;
    res.status(201).json({ 
      message: 'Market trend added successfully', 
      trend: data[0] 
    });
  } catch (error) {
    console.error('Error adding market trend:', error);
    res.status(500).json({ error: 'Failed to add market trend' });
  }
});

// Add new market alert
router.post('/alerts', async (req, res) => {
  try {
    const alertData = req.body;
    
    const { data, error } = await supabase
      .from('market_alerts')
      .insert([alertData])
      .select();

    if (error) throw error;
    res.status(201).json({ 
      message: 'Market alert added successfully', 
      alert: data[0] 
    });
  } catch (error) {
    console.error('Error adding market alert:', error);
    res.status(500).json({ error: 'Failed to add market alert' });
  }
});

module.exports = router;
