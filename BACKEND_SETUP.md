# AgroConnect Backend Setup Guide

This guide will help you set up the Node.js backend server for AgroConnect with Supabase integration.

## 🏗️ Backend Architecture

The backend is built with:
- **Node.js** with Express.js
- **Supabase** with service key for database operations
- **CORS** enabled for frontend communication
- **RESTful API** design with proper error handling

## 📁 Backend Structure

```
server/
├── index.js              # Main server file
├── config.js             # Environment configuration
├── supabase.js           # Supabase client setup
├── package.json          # Dependencies and scripts
└── routes/
    ├── equipment.js      # Equipment API endpoints
    ├── bulkDeals.js      # Bulk deals API endpoints
    ├── forum.js          # Forum posts API endpoints
    ├── lending.js        # Lending circles API endpoints
    ├── expenses.js       # Expenses API endpoints
    ├── market.js         # Market insights API endpoints
    ├── schemes.js        # Government schemes API endpoints
    └── translator.js      # Translator API endpoints
```

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the server directory:

```env
# Supabase Configuration
SUPABASE_URL=https://yfcukflinfinmjvllwin.supabase.co
SUPABASE_SERVICE_KEY=your-service-key-here

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

### 3. Get Supabase Service Key

1. Go to your Supabase dashboard
2. Navigate to Settings > API
3. Copy your **service_role** key (not the anon key)
4. Replace `your-service-key-here` in the `.env` file

### 4. Set Up Database

Run the SQL scripts in your Supabase SQL editor:
1. `database_schema.sql` - Creates all tables
2. `database_data.sql` - Inserts sample data

### 5. Start the Backend Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

## 📡 API Endpoints

### Equipment API
- `GET /api/equipment` - Get all equipment
- `GET /api/equipment/available` - Get available equipment
- `GET /api/equipment/type/:type` - Get equipment by type
- `GET /api/equipment/search?q=query` - Search equipment
- `PATCH /api/equipment/:id/book` - Book equipment
- `POST /api/equipment` - Add new equipment
- `PUT /api/equipment/:id` - Update equipment
- `DELETE /api/equipment/:id` - Delete equipment

### Bulk Deals API
- `GET /api/bulk-deals` - Get all bulk deals
- `GET /api/bulk-deals/category/:category` - Get deals by category
- `PATCH /api/bulk-deals/:id/orders` - Update order count

### Forum API
- `GET /api/forum` - Get all forum posts
- `GET /api/forum/category/:category` - Get posts by category
- `GET /api/forum/language/:language` - Get posts by language
- `GET /api/forum/search?q=query` - Search posts
- `POST /api/forum` - Create new post
- `PATCH /api/forum/:id/likes` - Update likes

### Lending API
- `GET /api/lending/circles` - Get all lending circles
- `GET /api/lending/circles/active` - Get active circles
- `GET /api/lending/loans` - Get all loans
- `POST /api/lending/loans` - Create loan request
- `PATCH /api/lending/loans/:id/status` - Update loan status

### Expenses API
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/category/:category` - Get expenses by category
- `GET /api/expenses/total` - Get total expenses
- `POST /api/expenses` - Add new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Market API
- `GET /api/market/trends` - Get market trends
- `GET /api/market/alerts` - Get market alerts
- `GET /api/market/suggestions` - Get optimization suggestions

### Schemes API
- `GET /api/schemes` - Get all government schemes
- `GET /api/schemes/category/:category` - Get schemes by category
- `GET /api/schemes/active` - Get active schemes
- `GET /api/schemes/search?q=query` - Search schemes

### Translator API
- `GET /api/translator/phrases` - Get common phrases
- `GET /api/translator/phrases/category/:category` - Get phrases by category
- `POST /api/translator/translate` - Translate text

## 🔧 Frontend Configuration

Update your frontend `.env.local` file:

```env
VITE_API_URL=http://localhost:3001/api
```

## 🛡️ Security Features

### Service Key Usage
- Backend uses Supabase service key for full database access
- Frontend only communicates with backend API
- No direct database access from frontend

### CORS Configuration
- Configured to allow requests from frontend URL
- Credentials enabled for authenticated requests

### Error Handling
- Comprehensive error handling for all endpoints
- Proper HTTP status codes
- Detailed error messages in development mode

## 🚀 Production Deployment

### Environment Variables
Set these in your production environment:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_KEY` - Your Supabase service key
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Set to 'production'
- `FRONTEND_URL` - Your production frontend URL

### Deployment Options
- **Vercel**: Deploy as serverless functions
- **Railway**: Deploy as Node.js application
- **DigitalOcean**: Deploy on App Platform
- **AWS**: Deploy on EC2 or Lambda
- **Heroku**: Deploy as web application

## 🔍 Testing

### Health Check
```bash
curl http://localhost:3001/health
```

### Test Equipment API
```bash
curl http://localhost:3001/api/equipment
```

### Test Equipment Booking
```bash
curl -X PATCH http://localhost:3001/api/equipment/1/book
```

## 📊 Monitoring

### Logs
- All API requests are logged
- Error details logged in development mode
- Health check endpoint for monitoring

### Performance
- Efficient database queries with proper indexing
- Response caching where appropriate
- Error handling prevents server crashes

## 🛠️ Development

### Adding New Endpoints
1. Create route file in `routes/` directory
2. Add route to `index.js`
3. Update API client in frontend
4. Add TypeScript types

### Database Changes
1. Update Supabase schema
2. Update TypeScript interfaces
3. Update API endpoints if needed
4. Test all affected endpoints

## 🆘 Troubleshooting

### Common Issues

1. **Service Key Error**
   - Ensure you're using the service_role key, not anon key
   - Check key permissions in Supabase dashboard

2. **CORS Errors**
   - Verify FRONTEND_URL in environment variables
   - Check browser console for specific CORS errors

3. **Database Connection Issues**
   - Verify SUPABASE_URL is correct
   - Check Supabase project status
   - Ensure tables exist and have data

4. **Port Already in Use**
   - Change PORT in environment variables
   - Kill existing process on port 3001

### Debug Mode
Set `NODE_ENV=development` for detailed error messages and logging.

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
