-- AgroConnect Database Data Migration
-- Insert all hardcoded data from the React application

-- Insert equipment data
INSERT INTO equipment (name, type, owner, location, availability, price, original_price, discount, rating, reviews, features, next_available, image_url, offer, sponsored) VALUES
('John Deere Tractor 5075E', 'Tractor', 'Rajesh Kumar', 'Village Kharpur', 'Available', '₹800/day', '₹1,200/day', '33% off', 4.5, 128, ARRAY['75 HP', '4WD', 'Power Steering'], 'Today', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=200&fit=crop&crop=center', 'Bank Offer', false),
('Mahindra Harvester', 'Harvester', 'Suresh Patel', 'Village Rampur', 'Booked', '₹1,200/day', '₹1,800/day', '33% off', 4.8, 89, ARRAY['Self-propelled', 'Grain tank', 'Efficient cutting'], 'March 15', 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300&h=200&fit=crop&crop=center', 'Big Billion Days Price', true),
('Rotary Tiller', 'Tiller', 'Community Pool', 'Cooperative Center', 'Available', '₹400/day', '₹600/day', '33% off', 4.2, 156, ARRAY['6 feet width', 'Heavy duty', 'Low maintenance'], 'Today', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=200&fit=crop&crop=center', 'Bank Offer', false),
('Seed Drill Machine', 'Planter', 'Amit Singh', 'Village Greenfield', 'Available', '₹600/day', '₹900/day', '33% off', 4.6, 203, ARRAY['Precision planting', 'Multiple row', 'Fertilizer unit'], 'Tomorrow', 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=300&h=200&fit=crop&crop=center', 'Assured', false),
('Sprayer Machine', 'Sprayer', 'Priya Sharma', 'Village Sunflower', 'Available', '₹500/day', '₹750/day', '33% off', 4.3, 94, ARRAY['High pressure', 'Tank capacity 200L', 'Adjustable nozzle'], 'Today', 'https://images.unsplash.com/photo-1574940854776-3d9e4027a21c?w=300&h=200&fit=crop&crop=center', 'Bank Offer', false),
('Cultivator', 'Cultivator', 'Vikram Reddy', 'Village Cottonfield', 'Booked', '₹700/day', '₹1,050/day', '33% off', 4.4, 167, ARRAY['9 tines', 'Heavy duty', 'Adjustable depth'], 'March 20', 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=300&h=200&fit=crop&crop=center', 'Bestseller', false),
('Thresher Machine', 'Thresher', 'Community Pool', 'Cooperative Center', 'Available', '₹900/day', '₹1,350/day', '33% off', 4.7, 78, ARRAY['Electric powered', 'High efficiency', 'Easy operation'], 'Tomorrow', 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300&h=200&fit=crop&crop=center', 'Bank Offer', false),
('Plough', 'Plough', 'Deepak Mehta', 'Village Wheatfield', 'Available', '₹350/day', '₹525/day', '33% off', 4.1, 142, ARRAY['Moldboard', 'Adjustable width', 'Durable steel'], 'Today', 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=300&h=200&fit=crop&crop=center', 'Bank Offer', false),
('Irrigation Pump', 'Pump', 'Sunita Devi', 'Village Riverside', 'Booked', '₹450/day', '₹675/day', '33% off', 4.5, 115, ARRAY['Submersible', 'High flow rate', 'Energy efficient'], 'March 18', 'https://images.unsplash.com/photo-1574940854776-3d9e4027a21c?w=300&h=200&fit=crop&crop=center', 'Bank Offer', false);

-- Insert bulk deals data
INSERT INTO bulk_deals (title, description, min_quantity, current_orders, price_per_unit, original_price, savings, deadline, category, status) VALUES
('Premium Wheat Seeds', 'High-yield variety, disease resistant', 50, 32, 85, 100, 15, '2024-03-20', 'Seeds', 'Active'),
('NPK Fertilizer Bags', 'Balanced nutrition for all crops', 100, 87, 1200, 1400, 200, '2024-03-18', 'Fertilizer', 'Almost Full'),
('Organic Pesticide', 'Eco-friendly crop protection', 30, 12, 450, 550, 100, '2024-03-25', 'Pesticide', 'Active'),
('Drip Irrigation Kit', 'Complete water management system', 20, 18, 2800, 3200, 400, '2024-03-22', 'Equipment', 'Almost Full');

-- Insert forum posts data
INSERT INTO forum_posts (title, content, author, category, likes, replies, time_ago, has_voice_note, language, tags) VALUES
('Best practices for wheat crop in March', 'I''ve been farming wheat for 10 years and wanted to share some insights about planting in March conditions...', 'Ramesh Kumar', 'Crop Management', 24, 8, '2 hours ago', true, 'Hindi', ARRAY['wheat', 'planting', 'march']),
('Dealing with aphid infestation on cotton', 'My cotton crop is showing signs of aphid damage. Has anyone tried organic solutions that actually work?', 'Priya Patel', 'Pest Control', 16, 12, '5 hours ago', false, 'English', ARRAY['cotton', 'aphids', 'organic', 'pestcontrol']),
('Soil pH testing results and recommendations', 'Just got my soil test results back. pH is 6.2. Looking for advice on lime application rates...', 'Suresh Singh', 'Soil Health', 31, 15, '1 day ago', true, 'Bengali', ARRAY['soil', 'pH', 'lime', 'testing']),
('Water management during drought conditions', 'With the current drought situation, I''m looking for effective water conservation techniques...', 'Lakshmi Reddy', 'Water Management', 42, 23, '2 days ago', false, 'Telugu', ARRAY['drought', 'water', 'conservation', 'irrigation']);

-- Insert lending circles data
INSERT INTO lending_circles (name, description, total_members, max_members, interest_rate, loan_range, status, member_contribution, trust_score, completed_loans) VALUES
('Wheat Farmers Circle', 'Supporting wheat cultivation with seasonal loans', 12, 15, 8.00, '₹5,000 - ₹50,000', 'Active', 2000, 4.8, 45),
('Cotton Growers Collective', 'Equipment and input financing for cotton farmers', 8, 10, 9.00, '₹10,000 - ₹75,000', 'Active', 3000, 4.9, 32),
('Vegetable Farmers Support', 'Quick loans for vegetable farming needs', 15, 15, 7.50, '₹3,000 - ₹25,000', 'Full', 1500, 4.7, 67),
('Dairy Farmers Circle', 'Cattle purchase and dairy equipment loans', 6, 12, 8.50, '₹15,000 - ₹1,00,000', 'New', 5000, 4.6, 12);

-- Insert loans data
INSERT INTO loans (amount, purpose, status, approved_date, due_date, monthly_emi, circle_id) VALUES
(25000, 'Seed purchase for wheat crop', 'Approved', '2024-03-05', '2024-06-05', 8750, 1),
(15000, 'Fertilizer for cotton field', 'Pending', NULL, NULL, NULL, 2),
(10000, 'Hand tools and equipment', 'Repaid', '2023-12-15', '2024-02-28', NULL, 3);

-- Insert expenses data
INSERT INTO expenses (date, category, description, amount, type) VALUES
('2024-03-10', 'Seeds', 'Wheat seeds - Premium variety', 8500, 'Essential'),
('2024-03-08', 'Fertilizer', 'NPK fertilizer for wheat crop', 12000, 'Essential'),
('2024-03-05', 'Diesel', 'Fuel for tractor operations', 3200, 'Operational'),
('2024-03-03', 'Tools', 'Hand tools and small equipment', 1800, 'Equipment'),
('2024-03-01', 'Labor', 'Planting assistance - 3 workers', 2400, 'Labor');

-- Insert market trends data
INSERT INTO market_trends (crop, current_price, change_amount, change_percent, trend, prediction, best_sell_time, confidence) VALUES
('Wheat', '₹2,180/quintal', '+₹120', '+5.8%', 'up', 'Prices expected to rise further due to export demand', 'Next 2-3 weeks', 87),
('Cotton', '₹6,350/quintal', '-₹180', '-2.8%', 'down', 'Temporary dip, recovery expected after monsoon forecast', 'Wait 4-6 weeks', 73),
('Rice', '₹2,840/quintal', '+₹45', '+1.6%', 'up', 'Stable demand, government procurement ongoing', 'Current rates are good', 91),
('Sugarcane', '₹385/quintal', '+₹15', '+4.1%', 'up', 'Sugar mills increasing procurement rates', 'Sell now or within 1 week', 89);

-- Insert market alerts data
INSERT INTO market_alerts (type, title, description, action, priority, time_left) VALUES
('opportunity', 'High Demand for Organic Wheat', 'Premium buyers offering 20% above market rate for certified organic wheat in your region', 'Contact organic buyers', 'high', '3 days left'),
('warning', 'Cotton Price Volatility', 'International cotton prices showing high volatility. Consider hedging strategies.', 'Review pricing strategy', 'medium', 'Monitor closely'),
('opportunity', 'Government Procurement Open', 'Rice procurement centers opened in your district with guaranteed MSP rates', 'Visit procurement center', 'high', '2 weeks remaining');

-- Insert optimization suggestions data
INSERT INTO optimization_suggestions (category, title, impact, description, confidence, time_to_implement) VALUES
('Cost Reduction', 'Fertilizer Cost Optimization', 'Save ₹8,000/season', 'Switch to bio-fertilizers for 30% of your nitrogen needs. Our analysis shows 25% cost reduction with similar yields.', 82, 'Next planting season'),
('Revenue Enhancement', 'Crop Diversification', 'Increase revenue by 15%', 'Add pulses as intercrop with wheat. Current market demand is high and it improves soil nitrogen.', 76, 'Next sowing window'),
('Risk Management', 'Weather Insurance', NULL, 'Based on local weather patterns, crop insurance can protect against 40% yield loss scenarios.', 94, 'Before monsoon');

-- Insert government schemes data
INSERT INTO government_schemes (title, description, category, amount, eligibility, application_deadline, status, color, documents, benefits) VALUES
('PM-KISAN Samman Nidhi', 'Direct income support to farmers - ₹6,000 per year in three installments', 'Income Support', '₹6,000/year', 'Small & marginal farmers', 'No deadline - Ongoing', 'Active', 'bg-gradient-primary', ARRAY['Aadhaar Card', 'Land Records', 'Bank Details'], ARRAY['₹2,000 every 4 months', 'Direct bank transfer', 'No paperwork after registration']),
('Pradhan Mantri Fasal Bima Yojana', 'Comprehensive crop insurance scheme protecting farmers against natural calamities', 'Insurance', 'Premium varies by crop', 'All farmers', 'Before sowing season', 'Seasonal', 'bg-gradient-secondary', ARRAY['Land Records', 'Sowing Certificate', 'Bank Details'], ARRAY['Up to ₹2 lakh per hectare coverage', 'Low premium rates', 'Quick settlement process']),
('Kisan Credit Card', 'Easy access to credit for agriculture and allied activities', 'Credit', 'Up to ₹3 lakh', 'All farmers', 'Anytime', 'Active', 'bg-gradient-primary', ARRAY['Identity Proof', 'Address Proof', 'Land Documents'], ARRAY['4% interest rate', 'No collateral required', 'Flexible repayment']),
('Soil Health Card Scheme', 'Free soil testing and nutrient recommendations for better crop yield', 'Soil Health', 'Free service', 'All farmers', 'Ongoing', 'Active', 'bg-gradient-secondary', ARRAY['Land Records', 'Identity Proof'], ARRAY['Free soil testing', 'Customized fertilizer recommendations', 'Digital soil health card']),
('Pradhan Mantri Kisan Maan Dhan Yojana', 'Pension scheme for small and marginal farmers', 'Pension', '₹3,000/month after 60', 'Age 18-40, landholding up to 2 hectares', 'Ongoing', 'Active', 'bg-gradient-primary', ARRAY['Aadhaar Card', 'Bank Details', 'Land Records'], ARRAY['Guaranteed ₹3,000 monthly pension', 'Low contribution amount', 'Government co-contribution']),
('Formation of Farmer Producer Organizations', 'Support for forming and strengthening farmer collectives', 'Collective', '₹15-33 lakh support', 'Groups of 300+ farmers', 'Check with district collector', 'New', 'bg-gradient-secondary', ARRAY['Group Formation Documents', 'Business Plan', 'Member Details'], ARRAY['Financial assistance for 5 years', 'Technical support', 'Market linkage support']);

-- Insert common phrases data for translator
INSERT INTO common_phrases (english_text, hindi_text, category) VALUES
('What is the current market price?', 'वर्तमान बाजार मूल्य क्या है?', 'Market'),
('When should I plant wheat?', 'मुझे गेहूं कब लगाना चाहिए?', 'Crop Management'),
('My crops are showing pest damage', 'मेरी फसलों में कीट क्षति दिख रही है', 'Pest Control'),
('I need fertilizer for my field', 'मुझे अपने खेत के लिए उर्वरक चाहिए', 'Fertilizer'),
('Where can I get a tractor?', 'मुझे ट्रैक्टर कहाँ मिल सकता है?', 'Equipment'),
('How to apply for a loan?', 'ऋण के लिए आवेदन कैसे करें?', 'Finance');
