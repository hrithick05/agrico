// Frontend now uses backend API instead of direct Supabase calls
// The backend handles all Supabase operations with service key

const API_BASE_URL = 'http://localhost:3001/api'

// Database types
export interface Equipment {
  id: number
  name: string
  type: string
  owner: string
  location: string
  availability: string
  price: string
  original_price?: string
  discount?: string
  rating: number
  reviews: number
  features: string[]
  next_available: string
  image_url?: string
  offer?: string
  sponsored: boolean
  created_at: string
  updated_at: string
}

export interface BulkDeal {
  id: number
  title: string
  description: string
  min_quantity: number
  current_orders: number
  price_per_unit: number
  original_price: number
  savings: number
  deadline: string
  category: string
  status: string
  created_at: string
  updated_at: string
}

export interface ForumPost {
  id: number
  title: string
  content: string
  author: string
  category: string
  likes: number
  replies: number
  time_ago: string
  has_voice_note: boolean
  language: string
  tags: string[]
  created_at: string
  updated_at: string
}

export interface LendingCircle {
  id: number
  name: string
  description: string
  total_members: number
  max_members: number
  interest_rate: number
  loan_range: string
  status: string
  member_contribution: number
  trust_score: number
  completed_loans: number
  created_at: string
  updated_at: string
}

export interface Loan {
  id: number
  amount: number
  purpose: string
  status: string
  approved_date?: string
  applied_date?: string
  due_date?: string
  repaid_date?: string
  monthly_emi?: number
  circle_id: number
  created_at: string
  updated_at: string
}

export interface Expense {
  id: number
  date: string
  category: string
  description: string
  amount: number
  type: string
  created_at: string
  updated_at: string
}

export interface MarketTrend {
  id: number
  crop: string
  current_price: string
  change_amount: string
  change_percent: string
  trend: string
  prediction: string
  best_sell_time: string
  confidence: number
  created_at: string
  updated_at: string
}

export interface MarketAlert {
  id: number
  type: string
  title: string
  description: string
  action: string
  priority: string
  time_left: string
  created_at: string
  updated_at: string
}

export interface OptimizationSuggestion {
  id: number
  category: string
  title: string
  impact?: string
  description: string
  confidence: number
  time_to_implement: string
  created_at: string
  updated_at: string
}

export interface GovernmentScheme {
  id: number
  title: string
  description: string
  category: string
  amount: string
  eligibility: string
  application_deadline: string
  status: string
  color: string
  documents: string[]
  benefits: string[]
  created_at: string
  updated_at: string
}

export interface CommonPhrase {
  id: number
  english_text: string
  hindi_text: string
  category?: string
  created_at: string
  updated_at: string
}
