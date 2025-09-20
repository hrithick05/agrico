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
    const response = await fetch(`${API_BASE_URL}/forum`)
    if (!response.ok) throw new Error('Failed to fetch forum posts')
    return response.json()
  },

  async getByCategory(category: string): Promise<ForumPost[]> {
    const response = await fetch(`${API_BASE_URL}/forum/category/${category}`)
    if (!response.ok) throw new Error('Failed to fetch forum posts by category')
    return response.json()
  },

  async getByLanguage(language: string): Promise<ForumPost[]> {
    const response = await fetch(`${API_BASE_URL}/forum/language/${language}`)
    if (!response.ok) throw new Error('Failed to fetch forum posts by language')
    return response.json()
  },

  async search(query: string): Promise<ForumPost[]> {
    const response = await fetch(`${API_BASE_URL}/forum/search?q=${encodeURIComponent(query)}`)
    if (!response.ok) throw new Error('Failed to search forum posts')
    return response.json()
  },

  async createPost(post: Omit<ForumPost, 'id' | 'created_at' | 'updated_at'>): Promise<ForumPost> {
    const response = await fetch(`${API_BASE_URL}/forum`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post)
    })
    if (!response.ok) throw new Error('Failed to create forum post')
    const result = await response.json()
    return result.post
  },

  async updateLikes(id: number, newLikeCount: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/forum/${id}/likes`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newLikeCount })
    })
    if (!response.ok) throw new Error('Failed to update likes')
  }
}

// Lending Circles API
export const lendingApi = {
  async getCircles(): Promise<LendingCircle[]> {
    const response = await fetch(`${API_BASE_URL}/lending/circles`)
    if (!response.ok) throw new Error('Failed to fetch lending circles')
    return response.json()
  },

  async getActiveCircles(): Promise<LendingCircle[]> {
    const response = await fetch(`${API_BASE_URL}/lending/circles/active`)
    if (!response.ok) throw new Error('Failed to fetch active lending circles')
    return response.json()
  },

  async getLoans(): Promise<Loan[]> {
    const response = await fetch(`${API_BASE_URL}/lending/loans`)
    if (!response.ok) throw new Error('Failed to fetch loans')
    return response.json()
  },

  async createLoan(loan: Omit<Loan, 'id' | 'created_at' | 'updated_at'>): Promise<Loan> {
    const response = await fetch(`${API_BASE_URL}/lending/loans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loan)
    })
    if (!response.ok) throw new Error('Failed to create loan request')
    const result = await response.json()
    return result.loan
  },

  async updateLoanStatus(id: number, status: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/lending/loans/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    if (!response.ok) throw new Error('Failed to update loan status')
  }
}

// Expenses API
export const expensesApi = {
  async getAll(): Promise<Expense[]> {
    const response = await fetch(`${API_BASE_URL}/expenses`)
    if (!response.ok) throw new Error('Failed to fetch expenses')
    return response.json()
  },

  async getByCategory(category: string): Promise<Expense[]> {
    const response = await fetch(`${API_BASE_URL}/expenses/category/${category}`)
    if (!response.ok) throw new Error('Failed to fetch expenses by category')
    return response.json()
  },

  async createExpense(expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>): Promise<Expense> {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense)
    })
    if (!response.ok) throw new Error('Failed to create expense')
    const result = await response.json()
    return result.expense
  },

  async getTotalExpenses(): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/expenses/total`)
    if (!response.ok) throw new Error('Failed to fetch total expenses')
    const result = await response.json()
    return result.total
  }
}

// Market Insights API
export const marketApi = {
  async getTrends(): Promise<MarketTrend[]> {
    const response = await fetch(`${API_BASE_URL}/market/trends`)
    if (!response.ok) throw new Error('Failed to fetch market trends')
    return response.json()
  },

  async getAlerts(): Promise<MarketAlert[]> {
    const response = await fetch(`${API_BASE_URL}/market/alerts`)
    if (!response.ok) throw new Error('Failed to fetch market alerts')
    return response.json()
  },

  async getOptimizationSuggestions(): Promise<OptimizationSuggestion[]> {
    const response = await fetch(`${API_BASE_URL}/market/suggestions`)
    if (!response.ok) throw new Error('Failed to fetch optimization suggestions')
    return response.json()
  }
}

// Government Schemes API
export const schemesApi = {
  async getAll(): Promise<GovernmentScheme[]> {
    const response = await fetch(`${API_BASE_URL}/schemes`)
    if (!response.ok) throw new Error('Failed to fetch government schemes')
    return response.json()
  },

  async getByCategory(category: string): Promise<GovernmentScheme[]> {
    const response = await fetch(`${API_BASE_URL}/schemes/category/${category}`)
    if (!response.ok) throw new Error('Failed to fetch schemes by category')
    return response.json()
  },

  async getActiveSchemes(): Promise<GovernmentScheme[]> {
    const response = await fetch(`${API_BASE_URL}/schemes/active`)
    if (!response.ok) throw new Error('Failed to fetch active schemes')
    return response.json()
  },

  async search(query: string): Promise<GovernmentScheme[]> {
    const response = await fetch(`${API_BASE_URL}/schemes/search?q=${encodeURIComponent(query)}`)
    if (!response.ok) throw new Error('Failed to search schemes')
    return response.json()
  }
}

