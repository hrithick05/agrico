import React, { useState, useEffect } from 'react';

// Gemini API Configuration
const GEMINI_API_KEY = 'AIzaSyA4Jbq8ddRtvekjnk76MnWK_9jUNzbChK8';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';

// Rate limiting and caching
let lastApiCall = 0;
const API_COOLDOWN = 30000; // 30 seconds between API calls
const CACHE_DURATION = 300000; // 5 minutes cache
let cachedData: any = null;
let cacheTimestamp = 0;
let quotaExhausted = false;
let quotaResetTime = 0;

// Clear any existing error states
const clearErrorStates = () => {
  quotaExhausted = false;
  quotaResetTime = 0;
  cachedData = null;
  cacheTimestamp = 0;
  lastApiCall = 0;
  console.log('API key updated - cleared all error states');
};

// Reset quota state for new API key
clearErrorStates();

// Types
interface MarketTrend {
  crop: string;
  price: number;
  change: number;
  changeAmount: number;
  confidence: number;
  insight: string;
  bestTime: string;
}

interface MarketAlert {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  timeLeft: string;
  action: string;
  icon: string;
}

interface OptimizationSuggestion {
  title: string;
  description: string;
  category: string;
  benefit: string;
  confidence: number;
  implementation: string;
}

interface MarketMetrics {
  avgPrice: number;
  priceChange: number;
  volatility: string;
  volatilityDesc: string;
  opportunities: number;
  highPriority: number;
}

// Rate limiting function
const canMakeApiCall = (): boolean => {
  const now = Date.now();
  
  // Check if quota is exhausted - if so, don't make any calls
  if (quotaExhausted && now < quotaResetTime) {
    console.log(`Quota exhausted. Blocking API calls until ${new Date(quotaResetTime).toLocaleTimeString()}`);
    return false;
  }
  
  // Reset quota flag if reset time has passed
  if (quotaExhausted && now >= quotaResetTime) {
    console.log('Quota reset time reached. Resetting quota flag.');
    quotaExhausted = false;
    quotaResetTime = 0;
  }
  
  // Check regular cooldown
  const canCall = (now - lastApiCall) >= API_COOLDOWN;
  if (!canCall) {
    console.log(`Rate limited. Next call allowed at ${new Date(lastApiCall + API_COOLDOWN).toLocaleTimeString()}`);
  }
  
  return canCall;
};

const isCacheValid = (): boolean => {
  const now = Date.now();
  return cachedData && (now - cacheTimestamp) < CACHE_DURATION;
};

const setQuotaExhausted = (retryDelaySeconds: number = 3600) => {
  quotaExhausted = true;
  quotaResetTime = Date.now() + (retryDelaySeconds * 1000);
  console.log(`Quota exhausted. Will retry after ${retryDelaySeconds} seconds (${new Date(quotaResetTime).toLocaleTimeString()})`);
};

// AI Service Functions
const generateMarketAnalysis = async (crops: string[], setAiStatus?: (status: 'ai' | 'fallback') => void): Promise<MarketTrend[]> => {
  try {
    // Check rate limiting and quota exhaustion
    if (!canMakeApiCall()) {
      console.log('API call blocked - using cached/fallback data');
      setAiStatus?.('fallback');
      return getDefaultMarketTrends();
    }

    // Check cache first
    if (isCacheValid() && cachedData?.marketTrends) {
      console.log('Using cached market trends data');
      setAiStatus?.('ai');
      return cachedData.marketTrends;
    }

    const currentDate = new Date().toISOString().split('T')[0];
    const prompt = `You are an AI agricultural market analyst specializing in Tamil Nadu, India. Today is ${currentDate}. Analyze CURRENT market trends for Tamil Nadu farmers for these crops: ${crops.join(', ')}.

IMPORTANT: Generate FRESH, CURRENT data for Tamil Nadu farmers. Do not repeat previous data.

Provide Tamil Nadu-specific market data in this EXACT JSON format:
[
  {
    "crop": "Rice (Ponni)",
    "price": 2950,
    "change": 4.2,
    "changeAmount": 120,
    "confidence": 87,
    "insight": "Tamil Nadu Ponni rice prices surging due to export demand from Middle East markets. Thanjavur farmers seeing premium rates",
    "bestTime": "Sell within next 10 days for maximum profit"
  },
  {
    "crop": "Cotton",
    "price": 6450,
    "change": -2.1,
    "changeAmount": -140,
    "confidence": 82,
    "insight": "Tamil Nadu cotton prices declining in Coimbatore due to global market pressure. Salem farmers advised to wait",
    "bestTime": "Hold for 2-3 weeks for better rates"
  },
  {
    "crop": "Sugarcane",
    "price": 395,
    "change": 3.8,
    "changeAmount": 15,
    "confidence": 91,
    "insight": "Tamil Nadu sugar mills in Thanjavur offering excellent rates. Government procurement supporting prices",
    "bestTime": "Current rates are very favorable - sell now"
  },
  {
    "crop": "Groundnut",
    "price": 5350,
    "change": 5.5,
    "changeAmount": 280,
    "confidence": 85,
    "insight": "Tamil Nadu groundnut prices booming in Tirunelveli and Madurai. Export demand driving prices up",
    "bestTime": "Sell immediately for best returns"
  }
]

Requirements:
- Generate DIFFERENT prices and insights each time
- Use realistic Tamil Nadu market prices in INR per quintal (₹2,500-₹7,000 range)
- Focus on Tamil Nadu agricultural conditions and local markets
- Include specific Tamil Nadu districts: Thanjavur, Tirunelveli, Coimbatore, Salem, Madurai, Erode
- Reference Tamil Nadu's agricultural seasons (Kharif, Rabi, Zaid)
- Provide weekly percentage changes (-8% to +12% range)
- AI confidence levels between 75-95%
- Market insights based on Tamil Nadu's current agricultural conditions
- Practical timing recommendations for Tamil Nadu farmers
- Include export opportunities, government schemes, local market conditions

Return ONLY the JSON array, no additional text.`;

    console.log('Calling Gemini API for market analysis...');
    console.log('Prompt:', prompt.substring(0, 200) + '...');
    
    // Update last API call time
    lastApiCall = Date.now();
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024, // Reduced to save tokens
        }
      })
    });

    console.log('API Response Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      
      // Handle rate limiting specifically
      if (response.status === 429) {
        console.log('Rate limited - will retry later');
        
        // Check if it's quota exhaustion (daily limit)
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error?.details?.some((detail: any) => 
            detail['@type'] === 'type.googleapis.com/google.rpc.QuotaFailure' &&
            detail.violations?.some((violation: any) => 
              violation.quotaId?.includes('PerDay')
            )
          )) {
            // Daily quota exhausted - set longer retry time
            setQuotaExhausted(3600); // 1 hour
          } else {
            // Regular rate limit - shorter retry time
            setQuotaExhausted(60); // 1 minute
          }
        } catch (parseError) {
          // Default to 1 hour if we can't parse the error
          setQuotaExhausted(3600);
        }
        
        setAiStatus?.('fallback');
        return getDefaultMarketTrends();
      }
      
      // For other errors, don't throw - just use fallback data
      console.log(`API request failed with status ${response.status}, using fallback data`);
      setAiStatus?.('fallback');
      return getDefaultMarketTrends();
    }

    const data = await response.json();
    console.log('Gemini API Response:', data);
    
    const analysisText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (analysisText) {
      // Clean the response text
      const cleanedText = analysisText.trim().replace(/```json|```/g, '');
      
      try {
        const parsedData = JSON.parse(cleanedText);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          console.log('Successfully parsed AI market data:', parsedData);
          
          // Cache the data
          if (!cachedData) cachedData = {};
          cachedData.marketTrends = parsedData;
          cacheTimestamp = Date.now();
          
          setAiStatus?.('ai');
          return parsedData;
        }
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.log('Raw response text:', analysisText);
      }
    }
    
    console.log('Falling back to default data due to parsing issues');
    setAiStatus?.('fallback');
    return getDefaultMarketTrends();
  } catch (error) {
    console.log('Error fetching market analysis from Gemini, using fallback data:', error);
    setAiStatus?.('fallback');
    return getDefaultMarketTrends();
  }
};

const generateMarketAlerts = async (): Promise<MarketAlert[]> => {
  try {
    // Check rate limiting and quota exhaustion
    if (!canMakeApiCall()) {
      console.log('API call blocked - using cached/fallback alerts');
      return getDefaultMarketAlerts();
    }

    // Check cache first
    if (isCacheValid() && cachedData?.marketAlerts) {
      console.log('Using cached market alerts data');
      return cachedData.marketAlerts;
    }

    const currentDate = new Date().toISOString().split('T')[0];
    const prompt = `You are an AI agricultural market analyst specializing in Tamil Nadu, India. Today is ${currentDate}. Generate 3 FRESH, CURRENT market alerts for Tamil Nadu farmers.

IMPORTANT: Generate DIFFERENT alerts each time. Focus on CURRENT opportunities and challenges for Tamil Nadu farmers.

Provide Tamil Nadu-specific alerts in this EXACT JSON format:
[
  {
    "title": "Tamil Nadu Rice Export Boom",
    "description": "Middle East importers offering ₹3,200/quintal for Tamil Nadu Ponni rice. Thanjavur and Tirunelveli farmers getting premium rates 20% above MSP",
    "priority": "high",
    "timeLeft": "3 days left",
    "action": "Contact Chennai rice exporters immediately",
    "icon": "target"
  },
  {
    "title": "Tamil Nadu Cotton Price Alert",
    "description": "Cotton prices in Coimbatore and Salem districts dropping due to global market pressure. Tamil Nadu Agricultural Marketing Committee monitoring situation",
    "priority": "medium",
    "timeLeft": "Monitor closely",
    "action": "Check TNAMC daily price updates",
    "icon": "warning"
  },
  {
    "title": "Tamil Nadu Government Procurement",
    "description": "Tamil Nadu Civil Supplies Corporation opened procurement centers in Madurai and Erode with guaranteed MSP rates. Limited slots available",
    "priority": "high",
    "timeLeft": "1 week remaining",
    "action": "Visit nearest procurement center today",
    "icon": "target"
  }
]

Requirements:
- Generate DIFFERENT alerts each time
- Focus on Tamil Nadu-specific agricultural opportunities and challenges
- Include Tamil Nadu government schemes: PM-KISAN, Tamil Nadu Agricultural Development Programme
- Reference Tamil Nadu's major agricultural districts: Thanjavur, Tirunelveli, Coimbatore, Salem, Madurai, Erode
- Consider Tamil Nadu's major crops: Rice, Sugarcane, Cotton, Groundnut, Coconut, Banana, Turmeric, Spices
- Include Tamil Nadu Agricultural Marketing Committee (TNAMC) announcements
- Add Tamil Nadu-specific price volatility warnings
- Priority: "high", "medium", or "low"
- Icon: "target" or "warning"
- Make actions actionable for Tamil Nadu farmers
- Reference Tamil Nadu's agricultural seasons and local market conditions
- Include export opportunities, government procurement, weather alerts

Return ONLY the JSON array, no additional text.`;

    // Update last API call time
    lastApiCall = Date.now();

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024, // Reduced to save tokens
        }
      })
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.log('Rate limited - will retry later');
        return getDefaultMarketAlerts();
      }
      console.log(`API request failed with status ${response.status}, using fallback data`);
      return getDefaultMarketAlerts();
    }

    const data = await response.json();
    console.log('Gemini Alerts Response:', data);
    
    const alertsText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (alertsText) {
      const cleanedText = alertsText.trim().replace(/```json|```/g, '');
      
      try {
        const parsedData = JSON.parse(cleanedText);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          console.log('Successfully parsed AI alerts:', parsedData);
          
          // Cache the data
          if (!cachedData) cachedData = {};
          cachedData.marketAlerts = parsedData;
          cacheTimestamp = Date.now();
          
          return parsedData;
        }
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.log('Raw alerts response:', alertsText);
      }
    }
    
    console.log('Falling back to default alerts');
    return getDefaultMarketAlerts();
  } catch (error) {
    console.log('Error fetching market alerts from Gemini, using fallback data:', error);
    return getDefaultMarketAlerts();
  }
};

const generateOptimizationSuggestions = async (): Promise<OptimizationSuggestion[]> => {
  try {
    // Check rate limiting and quota exhaustion
    if (!canMakeApiCall()) {
      console.log('API call blocked - using cached/fallback suggestions');
      return getDefaultOptimizationSuggestions();
    }

    // Check cache first
    if (isCacheValid() && cachedData?.optimizationSuggestions) {
      console.log('Using cached optimization suggestions data');
      return cachedData.optimizationSuggestions;
    }

    const currentDate = new Date().toISOString().split('T')[0];
    const prompt = `You are an AI agricultural optimization expert specializing in Tamil Nadu, India. Today is ${currentDate}. Generate 3 FRESH, CURRENT AI-powered optimization suggestions for Tamil Nadu farmers.

IMPORTANT: Generate DIFFERENT suggestions each time. Focus on CURRENT opportunities for Tamil Nadu farmers.

Provide Tamil Nadu-specific suggestions in this EXACT JSON format:
[
  {
    "title": "Tamil Nadu Smart Irrigation System",
    "description": "Implement IoT-based drip irrigation with Tamil Nadu Agricultural University (TNAU) technology. Thanjavur farmers can reduce water usage by 45% while increasing yield by 25%",
    "category": "Cost Reduction",
    "benefit": "Save ₹15,000/acre in water and fertilizer costs",
    "confidence": 88,
    "implementation": "Install before next Kharif season (June 2024)"
  },
  {
    "title": "Tamil Nadu Organic Spice Cultivation",
    "description": "Add turmeric and ginger as intercrop with rice in Thanjavur region. Tamil Nadu Agricultural University recommends this for better soil health and 30% higher returns",
    "category": "Revenue Enhancement",
    "benefit": "Increase revenue by ₹25,000/acre",
    "confidence": 82,
    "implementation": "Start in next Rabi season (October 2024)"
  },
  {
    "title": "Tamil Nadu Weather-Based Insurance",
    "description": "Tamil Nadu Crop Insurance Scheme covers monsoon risks. Based on Tamil Nadu climate patterns, crop insurance can protect against 45% yield loss scenarios",
    "category": "Risk Management",
    "benefit": "Protect ₹60,000/acre investment",
    "confidence": 94,
    "implementation": "Enroll before Tamil Nadu monsoon (October 2024)"
  }
]

Requirements:
- Generate DIFFERENT suggestions each time
- Focus on Tamil Nadu-specific agricultural conditions and challenges
- Include Tamil Nadu government schemes: PM-KISAN, Tamil Nadu Agricultural Development Programme, Tamil Nadu Agricultural Marketing Committee
- Reference Tamil Nadu's major agricultural districts: Thanjavur, Tirunelveli, Coimbatore, Salem, Madurai, Erode, Vellore
- Consider Tamil Nadu's major crops: Rice, Sugarcane, Cotton, Groundnut, Coconut, Banana, Turmeric, Spices, Millets
- Include Tamil Nadu-specific irrigation methods: Tank irrigation, Well irrigation, Canal irrigation, Drip irrigation
- Add Tamil Nadu Agricultural University (TNAU) recommendations and research
- Include Tamil Nadu's climate conditions: Tropical climate, Monsoon patterns, Northeast monsoon
- Categories: "Cost Reduction", "Revenue Enhancement", "Risk Management"
- Confidence levels: 75-95%
- Practical implementation timelines for Tamil Nadu agricultural seasons
- Quantifiable benefits in INR for Tamil Nadu market conditions
- Reference Tamil Nadu's agricultural seasons: Kharif (June-September), Rabi (October-March), Zaid (April-May)
- Include modern technology, government subsidies, export opportunities

Return ONLY the JSON array, no additional text.`;

    // Update last API call time
    lastApiCall = Date.now();

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024, // Reduced to save tokens
        }
      })
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.log('Rate limited - will retry later');
        return getDefaultOptimizationSuggestions();
      }
      console.log(`API request failed with status ${response.status}, using fallback data`);
      return getDefaultOptimizationSuggestions();
    }

    const data = await response.json();
    console.log('Gemini Suggestions Response:', data);
    
    const suggestionsText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (suggestionsText) {
      const cleanedText = suggestionsText.trim().replace(/```json|```/g, '');
      
      try {
        const parsedData = JSON.parse(cleanedText);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          console.log('Successfully parsed AI suggestions:', parsedData);
          
          // Cache the data
          if (!cachedData) cachedData = {};
          cachedData.optimizationSuggestions = parsedData;
          cacheTimestamp = Date.now();
          
          return parsedData;
        }
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.log('Raw suggestions response:', suggestionsText);
      }
    }
    
    console.log('Falling back to default suggestions');
    return getDefaultOptimizationSuggestions();
  } catch (error) {
    console.log('Error fetching optimization suggestions from Gemini, using fallback data:', error);
    return getDefaultOptimizationSuggestions();
  }
};

// 10 Different datasets for market trends - Tamil Nadu specific
const getDefaultMarketTrends = (): MarketTrend[] => {
  const datasets = [
    // Dataset 1: High demand period
    [
      { crop: 'Rice (Ponni)', price: 3120, change: 5.2, changeAmount: 155, confidence: 89, insight: 'Tamil Nadu Ponni rice prices surging due to festival demand from Kerala markets', bestTime: 'Sell within next 10 days' },
      { crop: 'Cotton', price: 6580, change: 2.1, changeAmount: 135, confidence: 82, insight: 'Tamil Nadu cotton prices rising in Coimbatore due to export demand', bestTime: 'Current rates are good' },
      { crop: 'Sugarcane', price: 395, change: 4.8, changeAmount: 18, confidence: 91, insight: 'Tamil Nadu sugar mills in Thanjavur offering premium rates', bestTime: 'Sell now for maximum profit' },
      { crop: 'Groundnut', price: 5450, change: 6.5, changeAmount: 335, confidence: 85, insight: 'Tamil Nadu groundnut prices booming in Tirunelveli markets', bestTime: 'Sell immediately' }
    ],
    // Dataset 2: Monsoon impact
    [
      { crop: 'Rice (Ponni)', price: 2890, change: -2.1, changeAmount: -62, confidence: 78, insight: 'Tamil Nadu rice prices declining due to good monsoon predictions', bestTime: 'Wait for better rates' },
      { crop: 'Cotton', price: 6120, change: -3.5, changeAmount: -222, confidence: 81, insight: 'Tamil Nadu cotton prices falling in Salem due to global market pressure', bestTime: 'Hold for 2-3 weeks' },
      { crop: 'Sugarcane', price: 375, change: 1.2, changeAmount: 4, confidence: 87, insight: 'Tamil Nadu sugarcane prices stable in Madurai region', bestTime: 'Current rates acceptable' },
      { crop: 'Groundnut', price: 5080, change: 2.8, changeAmount: 138, confidence: 83, insight: 'Tamil Nadu groundnut prices steady in Erode markets', bestTime: 'Monitor for better rates' }
    ],
    // Dataset 3: Export opportunities
    [
      { crop: 'Rice (Ponni)', price: 3280, change: 7.8, changeAmount: 238, confidence: 92, insight: 'Tamil Nadu Ponni rice export demand from Middle East increasing', bestTime: 'Sell within next 5 days' },
      { crop: 'Cotton', price: 6720, change: 4.2, changeAmount: 271, confidence: 88, insight: 'Tamil Nadu cotton prices rising due to China import demand', bestTime: 'Current rates excellent' },
      { crop: 'Sugarcane', price: 410, change: 6.5, changeAmount: 25, confidence: 90, insight: 'Tamil Nadu sugar mills offering export rates in Chennai', bestTime: 'Sell now for best returns' },
      { crop: 'Groundnut', price: 5620, change: 8.1, changeAmount: 421, confidence: 86, insight: 'Tamil Nadu groundnut export prices surging in Tuticorin', bestTime: 'Sell immediately' }
    ],
    // Dataset 4: Government procurement
    [
      { crop: 'Rice (Ponni)', price: 2750, change: 1.5, changeAmount: 41, confidence: 95, insight: 'Tamil Nadu Civil Supplies Corporation MSP rates in effect', bestTime: 'Sell to government centers' },
      { crop: 'Cotton', price: 5980, change: -1.2, changeAmount: -73, confidence: 79, insight: 'Tamil Nadu cotton prices stable with government support', bestTime: 'Wait for procurement announcement' },
      { crop: 'Sugarcane', price: 365, change: 2.8, changeAmount: 10, confidence: 93, insight: 'Tamil Nadu sugar mills offering guaranteed MSP rates', bestTime: 'Sell to nearest mill' },
      { crop: 'Groundnut', price: 4920, change: 3.1, changeAmount: 148, confidence: 84, insight: 'Tamil Nadu groundnut prices supported by government schemes', bestTime: 'Current rates favorable' }
    ],
    // Dataset 5: Weather concerns
    [
      { crop: 'Rice (Ponni)', price: 3020, change: 3.8, changeAmount: 110, confidence: 76, insight: 'Tamil Nadu rice prices rising due to drought concerns in delta region', bestTime: 'Sell before monsoon' },
      { crop: 'Cotton', price: 6420, change: 1.5, changeAmount: 95, confidence: 80, insight: 'Tamil Nadu cotton prices stable despite weather warnings', bestTime: 'Monitor weather updates' },
      { crop: 'Sugarcane', price: 385, change: 3.2, changeAmount: 12, confidence: 85, insight: 'Tamil Nadu sugarcane prices rising due to water scarcity fears', bestTime: 'Sell soon' },
      { crop: 'Groundnut', price: 5280, change: 4.5, changeAmount: 228, confidence: 82, insight: 'Tamil Nadu groundnut prices increasing due to irrigation concerns', bestTime: 'Sell within next week' }
    ],
    // Dataset 6: Festival season
    [
      { crop: 'Rice (Ponni)', price: 3450, change: 9.2, changeAmount: 290, confidence: 94, insight: 'Tamil Nadu Ponni rice prices surging for Pongal festival demand', bestTime: 'Sell now for maximum profit' },
      { crop: 'Cotton', price: 6890, change: 5.8, changeAmount: 378, confidence: 89, insight: 'Tamil Nadu cotton prices rising for festival textile demand', bestTime: 'Current rates excellent' },
      { crop: 'Sugarcane', price: 425, change: 8.1, changeAmount: 32, confidence: 91, insight: 'Tamil Nadu sugarcane prices booming for festival sweets demand', bestTime: 'Sell immediately' },
      { crop: 'Groundnut', price: 5780, change: 10.2, changeAmount: 535, confidence: 87, insight: 'Tamil Nadu groundnut prices surging for festival oil demand', bestTime: 'Sell now' }
    ],
    // Dataset 7: Market volatility
    [
      { crop: 'Rice (Ponni)', price: 2680, change: -4.2, changeAmount: -117, confidence: 77, insight: 'Tamil Nadu rice prices declining due to market volatility', bestTime: 'Wait for stability' },
      { crop: 'Cotton', price: 5820, change: -5.1, changeAmount: -313, confidence: 75, insight: 'Tamil Nadu cotton prices falling due to global market uncertainty', bestTime: 'Hold for better rates' },
      { crop: 'Sugarcane', price: 355, change: -1.8, changeAmount: -6, confidence: 83, insight: 'Tamil Nadu sugarcane prices stable despite market volatility', bestTime: 'Current rates acceptable' },
      { crop: 'Groundnut', price: 4850, change: -2.5, changeAmount: -124, confidence: 78, insight: 'Tamil Nadu groundnut prices declining due to market pressure', bestTime: 'Wait for recovery' }
    ],
    // Dataset 8: Technology adoption
    [
      { crop: 'Rice (Ponni)', price: 3150, change: 6.8, changeAmount: 200, confidence: 88, insight: 'Tamil Nadu rice prices rising due to precision farming adoption', bestTime: 'Sell within next 2 weeks' },
      { crop: 'Cotton', price: 6580, change: 4.5, changeAmount: 283, confidence: 86, insight: 'Tamil Nadu cotton prices increasing with Bt cotton technology', bestTime: 'Current rates good' },
      { crop: 'Sugarcane', price: 395, change: 5.2, changeAmount: 20, confidence: 89, insight: 'Tamil Nadu sugarcane prices rising with drip irrigation adoption', bestTime: 'Sell now' },
      { crop: 'Groundnut', price: 5420, change: 7.2, changeAmount: 364, confidence: 84, insight: 'Tamil Nadu groundnut prices surging with organic farming', bestTime: 'Sell immediately' }
    ],
    // Dataset 9: Supply chain issues
    [
      { crop: 'Rice (Ponni)', price: 2920, change: 2.1, changeAmount: 60, confidence: 81, insight: 'Tamil Nadu rice prices rising due to transportation delays', bestTime: 'Sell when transport available' },
      { crop: 'Cotton', price: 6280, change: 1.8, changeAmount: 111, confidence: 79, insight: 'Tamil Nadu cotton prices stable despite supply chain issues', bestTime: 'Monitor logistics' },
      { crop: 'Sugarcane', price: 375, change: 2.5, changeAmount: 9, confidence: 85, insight: 'Tamil Nadu sugarcane prices rising due to mill capacity issues', bestTime: 'Sell to available mills' },
      { crop: 'Groundnut', price: 5120, change: 3.8, changeAmount: 188, confidence: 82, insight: 'Tamil Nadu groundnut prices increasing due to storage issues', bestTime: 'Sell soon' }
    ],
    // Dataset 10: International demand
    [
      { crop: 'Rice (Ponni)', price: 3380, change: 8.5, changeAmount: 265, confidence: 93, insight: 'Tamil Nadu Ponni rice export demand from Singapore increasing', bestTime: 'Sell within next 7 days' },
      { crop: 'Cotton', price: 6720, change: 6.2, changeAmount: 392, confidence: 90, insight: 'Tamil Nadu cotton prices rising due to Bangladesh textile demand', bestTime: 'Current rates excellent' },
      { crop: 'Sugarcane', price: 415, change: 7.8, changeAmount: 30, confidence: 92, insight: 'Tamil Nadu sugar export prices surging to Sri Lanka', bestTime: 'Sell now for best returns' },
      { crop: 'Groundnut', price: 5680, change: 9.1, changeAmount: 474, confidence: 88, insight: 'Tamil Nadu groundnut export prices booming to Malaysia', bestTime: 'Sell immediately' }
    ]
  ];

  // Select a random dataset
  const selectedDataset = datasets[Math.floor(Math.random() * datasets.length)];
  return selectedDataset;
};

const getDefaultMarketAlerts = (): MarketAlert[] => {
  const alertDatasets = [
    // Dataset 1: Export opportunities
    [
      { title: 'Tamil Nadu Rice Export Boom', description: 'Middle East importers offering ₹3,200/quintal for Ponni rice. Thanjavur farmers getting premium rates', priority: 'high' as const, timeLeft: '3 days left', action: 'Contact Chennai rice exporters', icon: 'target' as const },
      { title: 'Tamil Nadu Cotton Export Alert', description: 'China textile mills increasing cotton imports from Tamil Nadu. Coimbatore prices rising', priority: 'high' as const, timeLeft: '1 week left', action: 'Contact export agents in Salem', icon: 'target' as const },
      { title: 'Tamil Nadu Groundnut Export', description: 'Malaysia oil companies seeking Tamil Nadu groundnut. Tuticorin port handling exports', priority: 'medium' as const, timeLeft: '2 weeks left', action: 'Register with export promotion council', icon: 'target' as const }
    ],
    // Dataset 2: Government schemes
    [
      { title: 'Tamil Nadu MSP Procurement', description: 'Tamil Nadu Civil Supplies Corporation opened 15 new procurement centers across delta region', priority: 'high' as const, timeLeft: '1 month left', action: 'Visit nearest procurement center', icon: 'target' as const },
      { title: 'PM-KISAN Scheme Update', description: 'Next installment of ₹2,000 due for Tamil Nadu farmers. Check your bank account', priority: 'medium' as const, timeLeft: '2 weeks left', action: 'Verify bank account details', icon: 'warning' as const },
      { title: 'Tamil Nadu Crop Insurance', description: 'Weather-based crop insurance claims open for Kharif season. Last date approaching', priority: 'high' as const, timeLeft: '5 days left', action: 'Submit insurance documents', icon: 'target' as const }
    ],
    // Dataset 3: Weather alerts
    [
      { title: 'Tamil Nadu Monsoon Alert', description: 'Northeast monsoon expected to arrive early. Prepare for heavy rains in delta region', priority: 'high' as const, timeLeft: '1 week left', action: 'Complete harvesting before rains', icon: 'warning' as const },
      { title: 'Drought Warning', description: 'Water levels in Tamil Nadu reservoirs below normal. Irrigation department monitoring', priority: 'medium' as const, timeLeft: 'Monitor closely', action: 'Use water efficiently', icon: 'warning' as const },
      { title: 'Cyclone Alert', description: 'Low pressure system forming in Bay of Bengal. Coastal districts on alert', priority: 'high' as const, timeLeft: '3 days left', action: 'Secure crops and equipment', icon: 'warning' as const }
    ],
    // Dataset 4: Market volatility
    [
      { title: 'Tamil Nadu Rice Price Drop', description: 'Rice prices falling 8% in Thanjavur due to oversupply. Market correction expected', priority: 'medium' as const, timeLeft: 'Monitor closely', action: 'Wait for price recovery', icon: 'warning' as const },
      { title: 'Cotton Price Volatility', description: 'Cotton prices fluctuating 12% in Coimbatore. Global market uncertainty affecting local prices', priority: 'medium' as const, timeLeft: '2 weeks left', action: 'Monitor daily price updates', icon: 'warning' as const },
      { title: 'Sugarcane Payment Delay', description: 'Sugar mills delaying payments to farmers. Tamil Nadu government investigating', priority: 'high' as const, timeLeft: '1 week left', action: 'Contact sugar mill management', icon: 'warning' as const }
    ],
    // Dataset 5: Technology adoption
    [
      { title: 'Tamil Nadu Precision Farming', description: 'Government promoting precision farming techniques. Subsidies available for GPS equipment', priority: 'medium' as const, timeLeft: '2 months left', action: 'Apply for precision farming scheme', icon: 'target' as const },
      { title: 'Drone Technology for Agriculture', description: 'Tamil Nadu Agricultural University offering drone training for crop monitoring', priority: 'low' as const, timeLeft: '1 month left', action: 'Register for drone training', icon: 'target' as const },
      { title: 'IoT Irrigation Systems', description: 'Smart irrigation systems available with 50% subsidy. Reduce water usage by 40%', priority: 'medium' as const, timeLeft: '3 months left', action: 'Contact agricultural department', icon: 'target' as const }
    ],
    // Dataset 6: Festival season
    [
      { title: 'Pongal Festival Demand', description: 'Rice and sugarcane prices surging ahead of Pongal festival. Peak demand period', priority: 'high' as const, timeLeft: '2 weeks left', action: 'Sell at current high prices', icon: 'target' as const },
      { title: 'Diwali Groundnut Demand', description: 'Groundnut oil demand increasing for Diwali sweets. Prices rising in Madurai markets', priority: 'medium' as const, timeLeft: '1 month left', action: 'Prepare groundnut for sale', icon: 'target' as const },
      { title: 'Wedding Season Cotton', description: 'Cotton prices rising due to wedding season demand. Textile mills increasing production', priority: 'medium' as const, timeLeft: '6 weeks left', action: 'Sell cotton to textile mills', icon: 'target' as const }
    ],
    // Dataset 7: Supply chain issues
    [
      { title: 'Transportation Strike', description: 'Truck drivers strike affecting crop transportation. Prices rising due to supply shortage', priority: 'high' as const, timeLeft: '3 days left', action: 'Use alternative transport', icon: 'warning' as const },
      { title: 'Storage Facility Shortage', description: 'Warehouse capacity full in major markets. Farmers facing storage problems', priority: 'medium' as const, timeLeft: '2 weeks left', action: 'Find alternative storage', icon: 'warning' as const },
      { title: 'Cold Storage Maintenance', description: 'Cold storage facilities under maintenance. Vegetable prices may fluctuate', priority: 'low' as const, timeLeft: '1 week left', action: 'Plan storage accordingly', icon: 'warning' as const }
    ],
    // Dataset 8: International markets
    [
      { title: 'Global Rice Price Rise', description: 'International rice prices increasing due to supply shortage. Tamil Nadu exports benefiting', priority: 'high' as const, timeLeft: '1 month left', action: 'Contact export agents', icon: 'target' as const },
      { title: 'China Cotton Import Ban', description: 'China restricting cotton imports affecting global prices. Tamil Nadu cotton prices declining', priority: 'medium' as const, timeLeft: 'Monitor closely', action: 'Find alternative markets', icon: 'warning' as const },
      { title: 'EU Organic Certification', description: 'European Union offering organic certification for Tamil Nadu farmers. Premium prices available', priority: 'low' as const, timeLeft: '6 months left', action: 'Apply for organic certification', icon: 'target' as const }
    ],
    // Dataset 9: Government policies
    [
      { title: 'New MSP Rates', description: 'Government announces new MSP rates for Kharif crops. Rice MSP increased by ₹200/quintal', priority: 'high' as const, timeLeft: '1 week left', action: 'Check new MSP rates', icon: 'target' as const },
      { title: 'Fertilizer Subsidy', description: 'Fertilizer subsidy increased by 15% for Tamil Nadu farmers. Apply for subsidy', priority: 'medium' as const, timeLeft: '2 months left', action: 'Apply for fertilizer subsidy', icon: 'target' as const },
      { title: 'Land Reform Policy', description: 'New land consolidation policy announced. Small farmers can merge holdings', priority: 'low' as const, timeLeft: '3 months left', action: 'Contact revenue department', icon: 'target' as const }
    ],
    // Dataset 10: Research and development
    [
      { title: 'New Rice Variety', description: 'TNAU releases drought-resistant rice variety. 20% higher yield in water-scarce areas', priority: 'medium' as const, timeLeft: '1 month left', action: 'Contact TNAU for seeds', icon: 'target' as const },
      { title: 'Bio-fertilizer Trial', description: 'Bio-fertilizer trials showing 15% yield increase. Free samples available for testing', priority: 'low' as const, timeLeft: '2 months left', action: 'Apply for bio-fertilizer trial', icon: 'target' as const },
      { title: 'Climate Smart Agriculture', description: 'Climate smart agriculture techniques training program. Adapt to climate change', priority: 'medium' as const, timeLeft: '1 month left', action: 'Register for training program', icon: 'target' as const }
    ]
  ];

  // Select a random dataset
  const selectedDataset = alertDatasets[Math.floor(Math.random() * alertDatasets.length)];
  return selectedDataset;
};

const getDefaultOptimizationSuggestions = (): OptimizationSuggestion[] => {
  const suggestionDatasets = [
    // Dataset 1: Water management
    [
      { title: 'Tamil Nadu Rice SRI Method', description: 'System of Rice Intensification increases yield 25% while reducing water usage 40% in Thanjavur delta', category: 'Cost Reduction', benefit: 'Save ₹15,000/acre in water costs', confidence: 89, implementation: 'Next Kharif season' },
      { title: 'Drip Irrigation for Vegetables', description: 'Drip irrigation for tomato and brinjal cultivation reduces water usage by 60% in Coimbatore region', category: 'Cost Reduction', benefit: 'Save ₹8,000/acre in water costs', confidence: 85, implementation: 'Next planting season' },
      { title: 'Rainwater Harvesting', description: 'Install farm ponds to store rainwater for irrigation during dry periods in Madurai district', category: 'Risk Management', benefit: 'Ensure water security', confidence: 92, implementation: 'Before monsoon season' }
    ],
    // Dataset 2: Soil health
    [
      { title: 'Tamil Nadu Soil Testing', description: 'Regular soil testing helps optimize fertilizer usage and improve crop yields across Tamil Nadu', category: 'Cost Reduction', benefit: 'Save ₹5,000/acre in fertilizer costs', confidence: 87, implementation: 'Before next season' },
      { title: 'Organic Composting', description: 'Convert farm waste into organic compost to improve soil fertility naturally in Erode region', category: 'Revenue Enhancement', benefit: 'Increase yield by 15%', confidence: 83, implementation: 'Start composting now' },
      { title: 'Green Manure Crops', description: 'Plant green manure crops like sunnhemp to improve soil nitrogen content in Salem district', category: 'Cost Reduction', benefit: 'Reduce fertilizer need by 30%', confidence: 79, implementation: 'Next fallow period' }
    ],
    // Dataset 3: Pest management
    [
      { title: 'Tamil Nadu IPM Techniques', description: 'Integrated Pest Management reduces pesticide costs by 30% and improves crop quality in Coimbatore', category: 'Cost Reduction', benefit: 'Save ₹3,000/acre in pesticide costs', confidence: 86, implementation: 'Next crop cycle' },
      { title: 'Biological Pest Control', description: 'Use beneficial insects and natural predators to control pest populations in Thanjavur region', category: 'Revenue Enhancement', benefit: 'Improve crop quality by 20%', confidence: 81, implementation: 'Start with next crop' },
      { title: 'Trap Crops', description: 'Plant trap crops to attract pests away from main crops in Tirunelveli district', category: 'Cost Reduction', benefit: 'Reduce pest damage by 40%', confidence: 77, implementation: 'Next planting season' }
    ],
    // Dataset 4: Technology adoption
    [
      { title: 'Tamil Nadu Precision Farming', description: 'Use GPS and sensors for precise application of inputs and better crop management in Salem', category: 'Revenue Enhancement', benefit: 'Increase yield by 20%', confidence: 88, implementation: 'Next 6 months' },
      { title: 'Drone Crop Monitoring', description: 'Use drones for crop monitoring, pest detection, and yield estimation in Madurai region', category: 'Cost Reduction', benefit: 'Reduce monitoring costs by 50%', confidence: 84, implementation: 'Next season' },
      { title: 'Mobile App for Farming', description: 'Use mobile apps for weather updates, market prices, and farming advice across Tamil Nadu', category: 'Revenue Enhancement', benefit: 'Increase profits by 10%', confidence: 82, implementation: 'Immediately' }
    ],
    // Dataset 5: Crop diversification
    [
      { title: 'Tamil Nadu Multi-Cropping', description: 'Grow multiple crops in same field to increase income and reduce risk in Thanjavur delta', category: 'Revenue Enhancement', benefit: 'Increase income by 30%', confidence: 85, implementation: 'Next cropping season' },
      { title: 'High-Value Crops', description: 'Switch to high-value crops like turmeric, ginger, or medicinal plants in Coimbatore hills', category: 'Revenue Enhancement', benefit: 'Increase profits by 50%', confidence: 90, implementation: 'Next year' },
      { title: 'Mixed Farming', description: 'Combine crop cultivation with livestock or poultry for additional income in Erode region', category: 'Revenue Enhancement', benefit: 'Add ₹25,000/acre income', confidence: 83, implementation: 'Next 6 months' }
    ],
    // Dataset 6: Market optimization
    [
      { title: 'Direct Market Sales', description: 'Sell directly to consumers through farmers markets or online platforms in Chennai', category: 'Revenue Enhancement', benefit: 'Increase prices by 25%', confidence: 87, implementation: 'Next harvest' },
      { title: 'Contract Farming', description: 'Enter into contracts with companies for guaranteed prices and market access in Salem', category: 'Risk Management', benefit: 'Guaranteed income', confidence: 91, implementation: 'Next season' },
      { title: 'Cooperative Marketing', description: 'Join farmers cooperative for better bargaining power and market access in Madurai', category: 'Revenue Enhancement', benefit: 'Increase prices by 15%', confidence: 79, implementation: 'Next month' }
    ],
    // Dataset 7: Financial management
    [
      { title: 'Tamil Nadu Crop Insurance', description: 'Insure crops against weather risks and natural disasters across Tamil Nadu', category: 'Risk Management', benefit: 'Protect ₹50,000/acre investment', confidence: 94, implementation: 'Before monsoon' },
      { title: 'Micro-Credit Access', description: 'Access micro-credit for farming inputs and equipment in rural Tamil Nadu', category: 'Cost Reduction', benefit: 'Reduce input costs by 20%', confidence: 86, implementation: 'Next month' },
      { title: 'Government Subsidies', description: 'Avail various government subsidies for seeds, fertilizers, and equipment', category: 'Cost Reduction', benefit: 'Save ₹10,000/acre', confidence: 89, implementation: 'Next season' }
    ],
    // Dataset 8: Post-harvest management
    [
      { title: 'Tamil Nadu Storage Solutions', description: 'Improve storage facilities to reduce post-harvest losses and maintain quality in Thanjavur', category: 'Revenue Enhancement', benefit: 'Reduce losses by 30%', confidence: 88, implementation: 'Next 3 months' },
      { title: 'Value Addition', description: 'Process raw produce into value-added products for higher profits in Coimbatore', category: 'Revenue Enhancement', benefit: 'Increase profits by 40%', confidence: 85, implementation: 'Next year' },
      { title: 'Cold Chain Management', description: 'Implement cold chain for perishable crops to maintain quality in Madurai', category: 'Revenue Enhancement', benefit: 'Maintain quality and prices', confidence: 82, implementation: 'Next 6 months' }
    ],
    // Dataset 9: Climate adaptation
    [
      { title: 'Climate-Resilient Crops', description: 'Grow drought-resistant and heat-tolerant crop varieties in Tamil Nadu', category: 'Risk Management', benefit: 'Ensure stable yields', confidence: 87, implementation: 'Next season' },
      { title: 'Weather-Based Farming', description: 'Use weather forecasts for better farming decisions across Tamil Nadu', category: 'Cost Reduction', benefit: 'Reduce weather risks by 50%', confidence: 83, implementation: 'Immediately' },
      { title: 'Water Conservation', description: 'Implement water conservation techniques for sustainable farming in Erode', category: 'Cost Reduction', benefit: 'Save ₹8,000/acre in water costs', confidence: 86, implementation: 'Next 2 months' }
    ],
    // Dataset 10: Knowledge and training
    [
      { title: 'Tamil Nadu Farmer Training', description: 'Attend training programs for modern farming techniques and best practices', category: 'Revenue Enhancement', benefit: 'Increase yield by 15%', confidence: 84, implementation: 'Next month' },
      { title: 'Study Tours', description: 'Visit successful farms to learn new techniques and practices in Tamil Nadu', category: 'Revenue Enhancement', benefit: 'Adopt best practices', confidence: 81, implementation: 'Next quarter' },
      { title: 'Farmer Field Schools', description: 'Participate in farmer field schools for hands-on learning in Coimbatore', category: 'Revenue Enhancement', benefit: 'Improve farming skills', confidence: 88, implementation: 'Next season' }
    ]
  ];

  // Select a random dataset
  const selectedDataset = suggestionDatasets[Math.floor(Math.random() * suggestionDatasets.length)];
  return selectedDataset;
};

const InsightsDashboard: React.FC = () => {
  // State management
  const [marketTrends, setMarketTrends] = useState<MarketTrend[]>([]);
  const [marketAlerts, setMarketAlerts] = useState<MarketAlert[]>([]);
  const [optimizationSuggestions, setOptimizationSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [marketMetrics, setMarketMetrics] = useState<MarketMetrics>({
    avgPrice: 2689,
    priceChange: 3.2,
    volatility: 'Medium',
    volatilityDesc: 'Stable conditions',
    opportunities: 7,
    highPriority: 3
  });
  const [loading, setLoading] = useState({
    trends: true,
    alerts: true,
    suggestions: true
  });
  const [error, setError] = useState<string | null>(null);
  const [aiStatus, setAiStatus] = useState<{
    marketTrends: 'ai' | 'fallback';
    alerts: 'ai' | 'fallback';
    suggestions: 'ai' | 'fallback';
  }>({
    marketTrends: 'fallback',
    alerts: 'fallback',
    suggestions: 'fallback'
  });
  const [expandedSuggestions, setExpandedSuggestions] = useState<Set<number>>(new Set());

  // Handle Learn More button click
  const handleLearnMore = (index: number) => {
    const newExpanded = new Set(expandedSuggestions);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSuggestions(newExpanded);
  };

  // Load AI data on component mount
  useEffect(() => {
    const loadAIData = async () => {
      try {
        setError(null);
        
        // Check if quota is exhausted before making any calls
        if (!canMakeApiCall()) {
          console.log('Quota exhausted on load - using fallback data');
          const trends = getDefaultMarketTrends();
          const alerts = getDefaultMarketAlerts();
          const suggestions = getDefaultOptimizationSuggestions();
          
          setMarketTrends(trends);
          setMarketAlerts(alerts);
          setOptimizationSuggestions(suggestions);
          setLoading({ trends: false, alerts: false, suggestions: false });
          
          setAiStatus({ 
            marketTrends: 'fallback', 
            alerts: 'fallback', 
            suggestions: 'fallback' 
          });
          
          // Calculate metrics from fallback data
          const avgPrice = trends.reduce((sum, trend) => sum + trend.price, 0) / trends.length;
          const avgChange = trends.reduce((sum, trend) => sum + trend.change, 0) / trends.length;
          setMarketMetrics(prev => ({
            ...prev,
            avgPrice: Math.round(avgPrice),
            priceChange: Math.round(avgChange * 10) / 10
          }));
          
          return;
        }
        
        // Load market trends - Tamil Nadu major crops
        const trends = await generateMarketAnalysis(['Rice (Ponni)', 'Cotton', 'Sugarcane', 'Groundnut'], (status) => 
          setAiStatus(prev => ({ ...prev, marketTrends: status }))
        );
        setMarketTrends(trends);
        setLoading(prev => ({ ...prev, trends: false }));

        // Load market alerts
        const alerts = await generateMarketAlerts();
        setMarketAlerts(alerts);
        setLoading(prev => ({ ...prev, alerts: false }));
        setAiStatus(prev => ({ ...prev, alerts: 'ai' }));

        // Load optimization suggestions
        const suggestions = await generateOptimizationSuggestions();
        setOptimizationSuggestions(suggestions);
        setLoading(prev => ({ ...prev, suggestions: false }));
        setAiStatus(prev => ({ ...prev, suggestions: 'ai' }));

        // Calculate dynamic metrics
        const avgPrice = trends.reduce((sum, trend) => sum + trend.price, 0) / trends.length;
        const avgChange = trends.reduce((sum, trend) => sum + trend.change, 0) / trends.length;
        setMarketMetrics(prev => ({
          ...prev,
          avgPrice: Math.round(avgPrice),
          priceChange: Math.round(avgChange * 10) / 10
        }));

      } catch (err) {
        setError('Failed to load AI data. Using default information.');
        setLoading({ trends: false, alerts: false, suggestions: false });
      }
    };

    loadAIData();
  }, []);

  // Refresh data function
  const refreshData = async () => {
    setLoading({ trends: true, alerts: true, suggestions: true });
    setError(null);
    
    try {
      console.log('Refreshing AI data...');
      
      // Check if we can make API calls
      if (!canMakeApiCall()) {
        console.log('API calls blocked - using fallback data with variations');
        const trends = getDefaultMarketTrends();
        const alerts = getDefaultMarketAlerts();
        const suggestions = getDefaultOptimizationSuggestions();
        
        setMarketTrends(trends);
        setMarketAlerts(alerts);
        setOptimizationSuggestions(suggestions);
        setLoading({ trends: false, alerts: false, suggestions: false });
        
        // Update AI status to fallback
        setAiStatus({ 
          marketTrends: 'fallback', 
          alerts: 'fallback', 
          suggestions: 'fallback' 
        });
        
        // Calculate metrics from fallback data
        const avgPrice = trends.reduce((sum, trend) => sum + trend.price, 0) / trends.length;
        const avgChange = trends.reduce((sum, trend) => sum + trend.change, 0) / trends.length;
        setMarketMetrics(prev => ({
          ...prev,
          avgPrice: Math.round(avgPrice),
          priceChange: Math.round(avgChange * 10) / 10
        }));
        
        return;
      }

      const [trends, alerts, suggestions] = await Promise.all([
        generateMarketAnalysis(['Rice (Ponni)', 'Cotton', 'Sugarcane', 'Groundnut'], (status) => 
          setAiStatus(prev => ({ ...prev, marketTrends: status }))
        ),
        generateMarketAlerts(),
        generateOptimizationSuggestions()
      ]);
      
      console.log('Refreshed data:', { trends, alerts, suggestions });
      
      setMarketTrends(trends);
      setMarketAlerts(alerts);
      setOptimizationSuggestions(suggestions);
      setLoading({ trends: false, alerts: false, suggestions: false });
      
      // Update AI status
      setAiStatus(prev => ({ 
        ...prev, 
        alerts: 'ai', 
        suggestions: 'ai' 
      }));
      
      // Calculate dynamic metrics
      const avgPrice = trends.reduce((sum, trend) => sum + trend.price, 0) / trends.length;
      const avgChange = trends.reduce((sum, trend) => sum + trend.change, 0) / trends.length;
      setMarketMetrics(prev => ({
        ...prev,
        avgPrice: Math.round(avgPrice),
        priceChange: Math.round(avgChange * 10) / 10
      }));
      
    } catch (err) {
      console.error('Refresh error:', err);
      setError('Failed to refresh data');
      setLoading({ trends: false, alerts: false, suggestions: false });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='1920' height='1080' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='field' x='0' y='0' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Crect width='100' height='100' fill='%23059669'/%3E%3Cpath d='M0 50 Q25 25 50 50 T100 50' stroke='%23059669' stroke-width='2' fill='none'/%3E%3Cpath d='M0 75 Q25 50 50 75 T100 75' stroke='%23059669' stroke-width='2' fill='none'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23field)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Supply & Demand Insights Banner */}
        <div className="bg-yellow-400 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Tamil Nadu Agricultural Insights</h2>
              <p className="text-lg text-gray-700">AI-powered market analysis and optimization recommendations for Tamil Nadu farmers</p>
              <p className="text-sm text-gray-600 mt-1">
                Last updated: {new Date().toLocaleString('en-IN', { 
                  timeZone: 'Asia/Kolkata',
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${aiStatus.marketTrends === 'ai' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium text-gray-800">
                {aiStatus.marketTrends === 'ai' ? 'Live AI Data' : 'Fallback Data'}
              </span>
            </div>
          </div>
      </div>


        {/* Market Alerts & Opportunities */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800">Market Alerts & Opportunities</h3>
            </div>
            <div className="flex gap-2 items-center">
              <button 
                onClick={refreshData}
                className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh AI Data</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-yellow-800 text-sm">{error}</span>
              </div>
            </div>
          )}

          {loading.alerts ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-200 animate-pulse">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                      <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-full mb-1"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {marketAlerts.map((alert, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        alert.priority === 'high' ? 'bg-green-100' : 
                        alert.priority === 'medium' ? 'bg-yellow-100' : 'bg-gray-100'
                      }`}>
                        {alert.icon === 'target' ? (
                          <svg className={`w-4 h-4 ${
                            alert.priority === 'high' ? 'text-green-600' : 
                            alert.priority === 'medium' ? 'text-yellow-600' : 'text-gray-600'
                          }`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className={`w-4 h-4 ${
                            alert.priority === 'high' ? 'text-green-600' : 
                            alert.priority === 'medium' ? 'text-yellow-600' : 'text-gray-600'
                          }`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{alert.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{alert.timeLeft}</p>
                        <span className={`inline-block text-xs px-2 py-1 rounded-full mt-2 ${
                          alert.priority === 'high' ? 'bg-green-100 text-green-800' : 
                          alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                            {alert.priority} priority
                        </span>
                        </div>
                      </div>
                    <button className="text-green-600 hover:text-green-700 font-medium text-sm">{alert.action}</button>
                    </div>
                  </div>
              ))}
                </div>
          )}
          </div>

        {/* Real-time Market Trends */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center mb-6">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800">Real-time Market Trends</h3>
                  </div>

          {loading.trends ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm animate-pulse">
                  <div className="flex justify-between items-start mb-3">
                    <div className="h-4 bg-gray-300 rounded w-16"></div>
                    <div className="h-3 bg-gray-300 rounded w-20"></div>
                  </div>
                  <div className="h-8 bg-gray-300 rounded w-24 mb-2"></div>
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="h-4 bg-gray-300 rounded w-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-12"></div>
                    <div className="h-4 bg-gray-300 rounded w-16"></div>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <div className="h-3 bg-gray-300 rounded w-20"></div>
                      <div className="h-3 bg-gray-300 rounded w-8"></div>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-2"></div>
                  </div>
                  <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded-full w-32"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {marketTrends.map((trend, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-gray-800">{trend.crop}</h4>
                    <button className="text-green-600 hover:text-green-700 text-sm font-medium">View Details</button>
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-2">₹{trend.price.toLocaleString()}/quintal</div>
                  <div className="flex items-center space-x-2 mb-3">
                    <svg className={`w-4 h-4 ${trend.change >= 0 ? 'text-green-600' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 20 20">
                      {trend.change >= 0 ? (
                        <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      )}
                    </svg>
                    <span className={`font-medium ${trend.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {trend.change >= 0 ? '+' : ''}{trend.change}%
                    </span>
                    <span className={`font-medium ${trend.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {trend.change >= 0 ? '+' : ''}₹{Math.abs(trend.changeAmount)}
                    </span>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">AI Confidence</span>
                      <span className="text-gray-800 font-medium">{trend.confidence}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: `${trend.confidence}%` }}></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{trend.insight}</p>
                  <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                    trend.change >= 2 ? 'bg-green-100 text-green-800' : 
                    trend.change <= -2 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    Best time: {trend.bestTime}
                    </div>
                  </div>
              ))}
            </div>
          )}
                </div>
                
        {/* AI Optimization Suggestions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center mb-6">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800">AI Optimization Suggestions</h3>
                  </div>

          {loading.suggestions ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-6 animate-pulse">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="h-6 bg-gray-300 rounded-full w-24"></div>
                    <div className="h-6 bg-gray-300 rounded-full w-32"></div>
                  </div>
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <div className="h-3 bg-gray-300 rounded w-24"></div>
                      <div className="h-3 bg-gray-300 rounded w-8"></div>
                </div>
                    <div className="w-full bg-gray-300 rounded-full h-2"></div>
                  </div>
                  <div className="mb-4">
                    <div className="h-3 bg-gray-300 rounded w-32"></div>
                  </div>
                  <div className="flex space-x-3">
                    <div className="h-10 bg-gray-300 rounded w-24"></div>
                    <div className="h-10 bg-gray-300 rounded w-28"></div>
                </div>
              </div>
            ))}
          </div>
          ) : (
          <div className="space-y-6">
              {optimizationSuggestions.map((suggestion, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full font-medium">{suggestion.category}</span>
                    {suggestion.benefit && (
                      <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium">{suggestion.benefit}</span>
                      )}
                    </div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-3">{suggestion.title}</h4>
                  <p className="text-gray-600 mb-4">{suggestion.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Confidence Level</span>
                      <span className="text-gray-800 font-medium">{suggestion.confidence}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: `${suggestion.confidence}%` }}></div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-gray-600 text-sm">Implementation: </span>
                    <span className="text-gray-800 text-sm font-medium">{suggestion.implementation}</span>
                  </div>

                  {/* Extended Data - Show when Learn More is clicked */}
                  {expandedSuggestions.has(index) && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
                      <h5 className="text-lg font-semibold text-gray-800 mb-3">Detailed Information</h5>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                          <h6 className="font-medium text-gray-700 mb-2">Expected Benefits:</h6>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• {suggestion.benefit}</li>
                            <li>• Improved crop yield and quality</li>
                            <li>• Reduced input costs and wastage</li>
                            <li>• Better market positioning</li>
                          </ul>
                          </div>
                        <div>
                          <h6 className="font-medium text-gray-700 mb-2">Implementation Steps:</h6>
                          <ol className="text-sm text-gray-600 space-y-1">
                            <li>1. Research and planning phase</li>
                            <li>2. Resource allocation and budgeting</li>
                            <li>3. Training and skill development</li>
                            <li>4. Gradual implementation and monitoring</li>
                          </ol>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h6 className="font-medium text-gray-700 mb-2">Success Factors:</h6>
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Proper Planning</span>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Technical Support</span>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Regular Monitoring</span>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Adaptation</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h6 className="font-medium text-gray-700 mb-2">Support Resources:</h6>
                        <div className="text-sm text-gray-600">
                          <p>• Contact Tamil Nadu Agricultural University for technical guidance</p>
                          <p>• Visit nearest Krishi Vigyan Kendra for training programs</p>
                          <p>• Connect with local farmer groups and cooperatives</p>
                          <p>• Access government schemes and subsidies</p>
                        </div>
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                      <div>
                            <p className="text-sm text-yellow-800 font-medium">Pro Tip:</p>
                            <p className="text-sm text-yellow-700">Start with a small pilot project to test the effectiveness before full-scale implementation. This reduces risk and allows for adjustments based on initial results.</p>
                      </div>
                    </div>
                  </div>
                </div>
                  )}

                  <div className="flex space-x-3">
                    <button 
                      onClick={() => handleLearnMore(index)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      {expandedSuggestions.has(index) ? 'Show Less' : 'Learn More'}
                    </button>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>

        {/* Bottom Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Avg Market Price */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-2xl font-bold text-gray-800">₹{marketMetrics.avgPrice.toLocaleString()}</h4>
                <p className={`text-sm font-medium ${marketMetrics.priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {marketMetrics.priceChange >= 0 ? '+' : ''}{marketMetrics.priceChange}% this week
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Avg Market Price</p>
          </div>

          {/* Market Volatility */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-2xl font-bold text-gray-800">{marketMetrics.volatility}</h4>
                <p className="text-sm text-gray-500">{marketMetrics.volatilityDesc}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Market Volatility</p>
          </div>

          {/* Opportunities */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-2xl font-bold text-gray-800">{marketMetrics.opportunities}</h4>
                <p className="text-sm text-gray-500">{marketMetrics.highPriority} high priority</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Opportunities</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsDashboard;
