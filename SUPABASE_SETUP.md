# Supabase Setup Guide for AgroConnect

This guide will help you set up Supabase as the backend for your AgroConnect application.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. A Supabase project created
3. Your project URL and anon key

## Step 1: Database Setup

### 1.1 Create Tables

Run the SQL script in `database_schema.sql` in your Supabase SQL editor:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `database_schema.sql`
4. Click "Run" to execute the script

This will create all necessary tables:
- `equipment` - Farming equipment data
- `bulk_deals` - Collective purchasing deals
- `forum_posts` - Community forum posts
- `lending_circles` - Micro-lending circles
- `loans` - Individual loan records
- `expenses` - Expense tracking
- `market_trends` - Market price trends
- `market_alerts` - Market alerts and opportunities
- `optimization_suggestions` - AI-powered suggestions
- `government_schemes` - Government schemes and benefits
- `common_phrases` - Translation phrases

### 1.2 Insert Sample Data

Run the SQL script in `database_data.sql` in your Supabase SQL editor:

1. Copy and paste the contents of `database_data.sql`
2. Click "Run" to execute the script

This will populate your database with all the hardcoded data from your React application.

## Step 2: Configure Authentication

### 2.1 Get Your Project Credentials

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy your Project URL and anon public key

### 2.2 Update Environment Variables

Create a `.env.local` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2.3 Update Supabase Configuration

Update `src/lib/supabase.ts` with your actual credentials:

```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
```

## Step 3: Install Dependencies

Install the Supabase client:

```bash
npm install @supabase/supabase-js
```

## Step 4: Enable Row Level Security (RLS)

For production, you should enable RLS on your tables. Run this SQL in your Supabase SQL editor:

```sql
-- Enable RLS on all tables
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE lending_circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE optimization_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE government_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE common_phrases ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (adjust as needed for your use case)
CREATE POLICY "Allow public read access" ON equipment FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON bulk_deals FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON forum_posts FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON lending_circles FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON loans FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON expenses FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON market_trends FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON market_alerts FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON optimization_suggestions FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON government_schemes FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON common_phrases FOR SELECT USING (true);

-- Allow public insert/update for certain tables (adjust as needed)
CREATE POLICY "Allow public insert" ON forum_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON loans FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON expenses FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON equipment FOR UPDATE USING (true);
CREATE POLICY "Allow public update" ON bulk_deals FOR UPDATE USING (true);
CREATE POLICY "Allow public update" ON forum_posts FOR UPDATE USING (true);
CREATE POLICY "Allow public update" ON loans FOR UPDATE USING (true);
CREATE POLICY "Allow public update" ON expenses FOR UPDATE USING (true);
```

## Step 5: Test Your Setup

1. Start your development server: `npm run dev`
2. Navigate to different pages to test data loading
3. Check the browser console for any errors
4. Verify that data is loading from Supabase instead of hardcoded values

## Step 6: Production Considerations

### 6.1 Environment Variables

Make sure to set up environment variables in your production environment:

- Vercel: Add environment variables in project settings
- Netlify: Add environment variables in site settings
- Other platforms: Follow their specific instructions

### 6.2 Database Backups

Set up regular database backups in Supabase:
1. Go to Settings > Database
2. Configure backup settings
3. Set up automated backups

### 6.3 Monitoring

Monitor your Supabase usage:
1. Check the Usage tab in your dashboard
2. Set up alerts for high usage
3. Monitor API calls and database performance

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your domain is added to the allowed origins in Supabase settings
2. **RLS Errors**: Check your RLS policies if you're getting permission errors
3. **Connection Issues**: Verify your project URL and anon key are correct
4. **Data Not Loading**: Check the browser console for API errors

### Debug Mode

Enable debug mode in your Supabase client:

```typescript
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    debug: true
  }
})
```

## Next Steps

1. **Authentication**: Implement user authentication for personalized features
2. **Real-time**: Enable real-time subscriptions for live updates
3. **File Storage**: Set up Supabase Storage for images and documents
4. **Edge Functions**: Create serverless functions for complex operations
5. **Analytics**: Set up analytics to track user behavior

## Support

- Supabase Documentation: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- GitHub Issues: Create an issue in your project repository
