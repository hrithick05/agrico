import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  equipmentApi, 
  bulkDealsApi, 
  forumApi, 
  lendingApi, 
  expensesApi, 
  marketApi, 
  schemesApi
} from '@/lib/api-backend'
import { useToast } from './use-toast'

// Equipment hooks
export const useEquipment = () => {
  return useQuery({
    queryKey: ['equipment'],
    queryFn: equipmentApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useEquipmentByType = (type: string) => {
  return useQuery({
    queryKey: ['equipment', 'type', type],
    queryFn: () => equipmentApi.getByType(type),
    enabled: !!type,
    staleTime: 5 * 60 * 1000,
  })
}

export const useAvailableEquipment = () => {
  return useQuery({
    queryKey: ['equipment', 'available'],
    queryFn: equipmentApi.getAvailable,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useSearchEquipment = (query: string) => {
  return useQuery({
    queryKey: ['equipment', 'search', query],
    queryFn: () => equipmentApi.search(query),
    enabled: !!query && query.length > 2,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

export const useBookEquipment = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: equipmentApi.bookEquipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] })
      toast({
        title: "Booking Confirmed! 🎉",
        description: "Equipment has been reserved for you. Check your phone for details.",
        variant: "default",
      })
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: "Unable to book equipment. Please try again.",
        variant: "destructive",
      })
    }
  })
}

// Bulk Deals hooks
export const useBulkDeals = () => {
  return useQuery({
    queryKey: ['bulk-deals'],
    queryFn: bulkDealsApi.getAll,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useBulkDealsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['bulk-deals', 'category', category],
    queryFn: () => bulkDealsApi.getByCategory(category),
    enabled: !!category,
    staleTime: 10 * 60 * 1000,
  })
}

export const useUpdateBulkDealOrders = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, newOrderCount }: { id: number; newOrderCount: number }) => 
      bulkDealsApi.updateOrders(id, newOrderCount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bulk-deals'] })
      toast({
        title: "Order Updated! 🛒",
        description: "Your order has been added to the collective purchase.",
        variant: "default",
      })
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Unable to update order. Please try again.",
        variant: "destructive",
      })
    }
  })
}

// Forum hooks
export const useForumPosts = () => {
  return useQuery({
    queryKey: ['forum-posts'],
    queryFn: forumApi.getAll,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useForumPostsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['forum-posts', 'category', category],
    queryFn: () => forumApi.getByCategory(category),
    enabled: !!category,
    staleTime: 2 * 60 * 1000,
  })
}

export const useForumPostsByLanguage = (language: string) => {
  return useQuery({
    queryKey: ['forum-posts', 'language', language],
    queryFn: () => forumApi.getByLanguage(language),
    enabled: !!language,
    staleTime: 2 * 60 * 1000,
  })
}

export const useSearchForumPosts = (query: string) => {
  return useQuery({
    queryKey: ['forum-posts', 'search', query],
    queryFn: () => forumApi.search(query),
    enabled: !!query && query.length > 2,
    staleTime: 1 * 60 * 1000,
  })
}

export const useCreateForumPost = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: forumApi.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] })
      toast({
        title: "Post Created! 📝",
        description: "Your knowledge has been shared with the community",
        variant: "default",
      })
    },
    onError: (error) => {
      toast({
        title: "Post Failed",
        description: "Unable to create post. Please try again.",
        variant: "destructive",
      })
    }
  })
}

export const useLikeForumPost = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, newLikeCount }: { id: number; newLikeCount: number }) => 
      forumApi.updateLikes(id, newLikeCount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] })
      toast({
        title: "Post Liked! ❤️",
        description: "Your appreciation has been recorded",
        variant: "default",
      })
    },
    onError: (error) => {
      toast({
        title: "Like Failed",
        description: "Unable to like post. Please try again.",
        variant: "destructive",
      })
    }
  })
}

// Lending hooks
export const useLendingCircles = () => {
  return useQuery({
    queryKey: ['lending-circles'],
    queryFn: lendingApi.getCircles,
    staleTime: 15 * 60 * 1000, // 15 minutes
  })
}

export const useActiveLendingCircles = () => {
  return useQuery({
    queryKey: ['lending-circles', 'active'],
    queryFn: lendingApi.getActiveCircles,
    staleTime: 15 * 60 * 1000,
  })
}

export const useLoans = () => {
  return useQuery({
    queryKey: ['loans'],
    queryFn: lendingApi.getLoans,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useCreateLoan = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: lendingApi.createLoan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] })
      toast({
        title: "Loan Request Submitted! 💰",
        description: "Your request has been sent to the circle members for approval",
        variant: "default",
      })
    },
    onError: (error) => {
      toast({
        title: "Loan Request Failed",
        description: "Unable to submit loan request. Please try again.",
        variant: "destructive",
      })
    }
  })
}

// Expenses hooks
export const useExpenses = () => {
  return useQuery({
    queryKey: ['expenses'],
    queryFn: expensesApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useExpensesByCategory = (category: string) => {
  return useQuery({
    queryKey: ['expenses', 'category', category],
    queryFn: () => expensesApi.getByCategory(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
  })
}

export const useTotalExpenses = () => {
  return useQuery({
    queryKey: ['expenses', 'total'],
    queryFn: expensesApi.getTotalExpenses,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateExpense = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: expensesApi.createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      toast({
        title: "Expense Added! 📊",
        description: "Expense recorded successfully",
        variant: "default",
      })
    },
    onError: (error) => {
      toast({
        title: "Expense Failed",
        description: "Unable to add expense. Please try again.",
        variant: "destructive",
      })
    }
  })
}

// Market Insights hooks
export const useMarketTrends = () => {
  return useQuery({
    queryKey: ['market-trends'],
    queryFn: marketApi.getTrends,
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

export const useMarketAlerts = () => {
  return useQuery({
    queryKey: ['market-alerts'],
    queryFn: marketApi.getAlerts,
    staleTime: 15 * 60 * 1000, // 15 minutes
  })
}

export const useOptimizationSuggestions = () => {
  return useQuery({
    queryKey: ['optimization-suggestions'],
    queryFn: marketApi.getOptimizationSuggestions,
    staleTime: 60 * 60 * 1000, // 1 hour
  })
}

// Government Schemes hooks
export const useGovernmentSchemes = () => {
  return useQuery({
    queryKey: ['government-schemes'],
    queryFn: schemesApi.getAll,
    staleTime: 60 * 60 * 1000, // 1 hour
  })
}

export const useSchemesByCategory = (category: string) => {
  return useQuery({
    queryKey: ['government-schemes', 'category', category],
    queryFn: () => schemesApi.getByCategory(category),
    enabled: !!category,
    staleTime: 60 * 60 * 1000,
  })
}

export const useActiveSchemes = () => {
  return useQuery({
    queryKey: ['government-schemes', 'active'],
    queryFn: schemesApi.getActiveSchemes,
    staleTime: 60 * 60 * 1000,
  })
}

export const useSearchSchemes = (query: string) => {
  return useQuery({
    queryKey: ['government-schemes', 'search', query],
    queryFn: () => schemesApi.search(query),
    enabled: !!query && query.length > 2,
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

