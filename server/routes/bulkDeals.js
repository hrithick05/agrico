const express = require('express');
const supabase = require('../supabase');
const router = express.Router();

// Get all bulk deals
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('bulk_deals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching bulk deals:', error);
    res.status(500).json({ error: 'Failed to fetch bulk deals' });
  }
});

// Get bulk deals by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { data, error } = await supabase
      .from('bulk_deals')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching bulk deals by category:', error);
    res.status(500).json({ error: 'Failed to fetch bulk deals by category' });
  }
});

// Update order count for bulk deal
router.patch('/:id/orders', async (req, res) => {
  try {
    const { id } = req.params;
    const { newOrderCount } = req.body;
    
    const { data, error } = await supabase
      .from('bulk_deals')
      .update({ 
        current_orders: newOrderCount, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    
    if (data.length === 0) {
      return res.status(404).json({ error: 'Bulk deal not found' });
    }

    res.json({ 
      message: 'Order count updated successfully', 
      bulkDeal: data[0] 
    });
  } catch (error) {
    console.error('Error updating order count:', error);
    res.status(500).json({ error: 'Failed to update order count' });
  }
});

// Add new bulk deal
router.post('/', async (req, res) => {
  try {
    const bulkDealData = req.body;
    
    const { data, error } = await supabase
      .from('bulk_deals')
      .insert([bulkDealData])
      .select();

    if (error) throw error;
    res.status(201).json({ 
      message: 'Bulk deal added successfully', 
      bulkDeal: data[0] 
    });
  } catch (error) {
    console.error('Error adding bulk deal:', error);
    res.status(500).json({ error: 'Failed to add bulk deal' });
  }
});

module.exports = router;
