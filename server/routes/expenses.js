const express = require('express');
const supabase = require('../supabase');
const router = express.Router();

// Get all expenses
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// Get expenses by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('category', category)
      .order('date', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching expenses by category:', error);
    res.status(500).json({ error: 'Failed to fetch expenses by category' });
  }
});

// Get total expenses
router.get('/total', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('amount');

    if (error) throw error;
    
    const total = data.reduce((sum, expense) => sum + expense.amount, 0);
    res.json({ total });
  } catch (error) {
    console.error('Error calculating total expenses:', error);
    res.status(500).json({ error: 'Failed to calculate total expenses' });
  }
});

// Add new expense
router.post('/', async (req, res) => {
  try {
    const expenseData = req.body;
    
    const { data, error } = await supabase
      .from('expenses')
      .insert([expenseData])
      .select();

    if (error) throw error;
    res.status(201).json({ 
      message: 'Expense added successfully', 
      expense: data[0] 
    });
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

// Update expense
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    updateData.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('expenses')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) throw error;
    
    if (data.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ 
      message: 'Expense updated successfully', 
      expense: data[0] 
    });
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// Delete expense
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

module.exports = router;
