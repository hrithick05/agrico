import { Equipment, BulkDeal, ForumPost, LendingCircle, Loan, Expense, MarketTrend, MarketAlert, OptimizationSuggestion, GovernmentScheme } from './supabase'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Equipment API
export const equipmentApi = {
  async getAll(): Promise<Equipment[]> {
    const response = await fetch(`${API_BASE_URL}/equipment`)
    if (!response.ok) throw new Error('Failed to fetch equipment')
    return response.json()
  },

  async getByType(type: string): Promise<Equipment[]> {
    const response = await fetch(`${API_BASE_URL}/equipment/type/${type}`)
    if (!response.ok) throw new Error('Failed to fetch equipment by type')
    return response.json()
  },

  async getAvailable(): Promise<Equipment[]> {
    const response = await fetch(`${API_BASE_URL}/equipment/available`)
    if (!response.ok) throw new Error('Failed to fetch available equipment')
    return response.json()
  },

  async search(query: string): Promise<Equipment[]> {
    const response = await fetch(`${API_BASE_URL}/equipment/search?q=${encodeURIComponent(query)}`)
    if (!response.ok) throw new Error('Failed to search equipment')
    return response.json()
  },

  async bookEquipment(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/equipment/${id}/book`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    })
    if (!response.ok) throw new Error('Failed to book equipment')
  }
}

// Bulk Deals API
export const bulkDealsApi = {
  async getAll(): Promise<BulkDeal[]> {
    const response = await fetch(`${API_BASE_URL}/bulk-deals`)
    if (!response.ok) throw new Error('Failed to fetch bulk deals')
    return response.json()
  },

  async getByCategory(category: string): Promise<BulkDeal[]> {
    const response = await fetch(`${API_BASE_URL}/bulk-deals/category/${category}`)
    if (!response.ok) throw new Error('Failed to fetch bulk deals by category')
    return response.json()
  },

  async updateOrders(id: number, newOrderCount: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/bulk-deals/${id}/orders`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newOrderCount })
    })
    if (!response.ok) throw new Error('Failed to update order count')
  }
}

// Forum Posts API
export const forumApi = {
  async getAll(): Promise<ForumPost[]> {
    const { data, error } = await supabase
      .from('forum_posts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getByCategory(category: string): Promise<ForumPost[]> {
    const { data, error } = await supabase
      .from('forum_posts')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getByLanguage(language: string): Promise<ForumPost[]> {
    const { data, error } = await supabase
      .from('forum_posts')
      .select('*')
      .eq('language', language)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async search(query: string): Promise<ForumPost[]> {
    const { data, error } = await supabase
      .from('forum_posts')
      .select('*')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async createPost(post: Omit<ForumPost, 'id' | 'created_at' | 'updated_at'>): Promise<ForumPost> {
    const { data, error } = await supabase
      .from('forum_posts')
      .insert([post])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateLikes(id: number, newLikeCount: number): Promise<void> {
    const { error } = await supabase
      .from('forum_posts')
      .update({ likes: newLikeCount, updated_at: new Date().toISOString() })
      .eq('id', id)
    
    if (error) throw error
  }
}

// Lending Circles API
export const lendingApi = {
  async getCircles(): Promise<LendingCircle[]> {
    const { data, error } = await supabase
      .from('lending_circles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getActiveCircles(): Promise<LendingCircle[]> {
    const { data, error } = await supabase
      .from('lending_circles')
      .select('*')
      .eq('status', 'Active')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getLoans(): Promise<Loan[]> {
    const { data, error } = await supabase
      .from('loans')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async createLoan(loan: Omit<Loan, 'id' | 'created_at' | 'updated_at'>): Promise<Loan> {
    const { data, error } = await supabase
      .from('loans')
      .insert([loan])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateLoanStatus(id: number, status: string): Promise<void> {
    const { error } = await supabase
      .from('loans')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
    
    if (error) throw error
  }
}

// Expenses API
export const expensesApi = {
  async getAll(): Promise<Expense[]> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getByCategory(category: string): Promise<Expense[]> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('category', category)
      .order('date', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async createExpense(expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>): Promise<Expense> {
    const { data, error } = await supabase
      .from('expenses')
      .insert([expense])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getTotalExpenses(): Promise<number> {
    const { data, error } = await supabase
      .from('expenses')
      .select('amount')
    
    if (error) throw error
    return data?.reduce((sum, expense) => sum + expense.amount, 0) || 0
  }
}

// Market Insights API
export const marketApi = {
  async getTrends(): Promise<MarketTrend[]> {
    const { data, error } = await supabase
      .from('market_trends')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getAlerts(): Promise<MarketAlert[]> {
    const { data, error } = await supabase
      .from('market_alerts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getOptimizationSuggestions(): Promise<OptimizationSuggestion[]> {
    const { data, error } = await supabase
      .from('optimization_suggestions')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }
}

// Government Schemes API
export const schemesApi = {
  async getAll(): Promise<GovernmentScheme[]> {
    const { data, error } = await supabase
      .from('government_schemes')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getByCategory(category: string): Promise<GovernmentScheme[]> {
    const { data, error } = await supabase
      .from('government_schemes')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getActiveSchemes(): Promise<GovernmentScheme[]> {
    const { data, error } = await supabase
      .from('government_schemes')
      .select('*')
      .eq('status', 'Active')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async search(query: string): Promise<GovernmentScheme[]> {
    const { data, error } = await supabase
      .from('government_schemes')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }
}

