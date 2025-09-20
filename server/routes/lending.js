const express = require('express');
const supabase = require('../supabase');
const router = express.Router();

// Get all lending circles
router.get('/circles', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('lending_circles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching lending circles:', error);
    res.status(500).json({ error: 'Failed to fetch lending circles' });
  }
});

// Get active lending circles
router.get('/circles/active', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('lending_circles')
      .select('*')
      .eq('status', 'Active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching active lending circles:', error);
    res.status(500).json({ error: 'Failed to fetch active lending circles' });
  }
});

// Get all loans
router.get('/loans', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('loans')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching loans:', error);
    res.status(500).json({ error: 'Failed to fetch loans' });
  }
});

// Create new loan
router.post('/loans', async (req, res) => {
  try {
    const loanData = req.body;
    
    const { data, error } = await supabase
      .from('loans')
      .insert([loanData])
      .select();

    if (error) throw error;
    res.status(201).json({ 
      message: 'Loan request created successfully', 
      loan: data[0] 
    });
  } catch (error) {
    console.error('Error creating loan:', error);
    res.status(500).json({ error: 'Failed to create loan request' });
  }
});

// Update loan status
router.patch('/loans/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const { data, error } = await supabase
      .from('loans')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    
    if (data.length === 0) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    res.json({ 
      message: 'Loan status updated successfully', 
      loan: data[0] 
    });
  } catch (error) {
    console.error('Error updating loan status:', error);
    res.status(500).json({ error: 'Failed to update loan status' });
  }
});

// Add new lending circle
router.post('/circles', async (req, res) => {
  try {
    const circleData = req.body;
    
    const { data, error } = await supabase
      .from('lending_circles')
      .insert([circleData])
      .select();

    if (error) throw error;
    res.status(201).json({ 
      message: 'Lending circle created successfully', 
      circle: data[0] 
    });
  } catch (error) {
    console.error('Error creating lending circle:', error);
    res.status(500).json({ error: 'Failed to create lending circle' });
  }
});

module.exports = router;
