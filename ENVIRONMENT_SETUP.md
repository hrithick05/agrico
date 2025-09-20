# Environment Variables Setup Guide

This guide explains how to set up environment variables for both frontend and backend components of AgroConnect.

## 📁 Environment Files Created

### 1. **Frontend Environment** (`env.example`)
```env
# Frontend Environment Variables
VITE_API_URL=http://localhost:3001/api
VITE_SUPABASE_URL=https://yfcukflinfinmjvllwin.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. **Backend Environment** (`server/env.example`)
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

## 🚀 Quick Setup Instructions

### **Step 1: Copy Environment Files**
```bash
# Copy frontend environment file
cp env.example .env.local

# Copy backend environment file
cp server/env.example server/.env
```

### **Step 2: Get Supabase Keys**

#### **For Frontend (.env.local):**
1. Go to your Supabase dashboard
2. Navigate to **Settings > API**
3. Copy the **anon/public** key
4. Replace `your-anon-key-here` in `.env.local`

#### **For Backend (server/.env):**
1. In the same Supabase dashboard
2. Copy the **service_role** key (⚠️ Keep this secret!)
3. Replace `your-service-key-here` in `server/.env`

### **Step 3: Configure URLs**

#### **Frontend Configuration:**
- `VITE_API_URL`: Backend API endpoint (default: `http://localhost:3001/api`)
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Public key for frontend

#### **Backend Configuration:**
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_KEY`: Service key for backend operations
- `PORT`: Backend server port (default: 3001)
- `NODE_ENV`: Environment mode (development/production)
- `FRONTEND_URL`: Frontend URL for CORS (default: `http://localhost:5173`)

## 🔐 Security Notes

### **Key Differences:**
- **Anon Key**: Safe for frontend, limited permissions
- **Service Key**: Backend only, full database access

### **Production Considerations:**
- Never commit `.env` files to version control
- Use environment variables in production deployment
- Rotate keys regularly
- Monitor key usage

## 🌍 Environment-Specific Configurations

### **Development (.env.local)**
```env
VITE_API_URL=http://localhost:3001/api
VITE_SUPABASE_URL=https://yfcukflinfinmjvllwin.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **Production**
```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_SUPABASE_URL=https://yfcukflinfinmjvllwin.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

## 🛠️ Troubleshooting

### **Common Issues:**

1. **"Failed to resolve import"**
   - Check if `.env.local` exists
   - Verify variable names start with `VITE_`
   - Restart development server

2. **CORS Errors**
   - Verify `FRONTEND_URL` in backend `.env`
   - Check if frontend URL matches exactly

3. **Database Connection Issues**
   - Verify Supabase URL is correct
   - Check if service key has proper permissions
   - Ensure tables exist in database

4. **API Connection Issues**
   - Verify `VITE_API_URL` points to running backend
   - Check if backend server is running on correct port

### **Debug Steps:**
1. Check environment variables are loaded:
   ```javascript
   console.log(import.meta.env.VITE_API_URL)
   ```

2. Verify backend is running:
   ```bash
   curl http://localhost:3001/health
   ```

3. Check Supabase connection:
   ```bash
   curl -H "Authorization: Bearer YOUR_SERVICE_KEY" \
        https://yfcukflinfinmjvllwin.supabase.co/rest/v1/
   ```

## 📋 Environment Checklist

- [ ] Frontend `.env.local` created with correct values
- [ ] Backend `server/.env` created with service key
- [ ] Supabase URL matches in both files
- [ ] API URL points to running backend
- [ ] CORS URL matches frontend development server
- [ ] All keys are valid and have proper permissions
- [ ] Development servers can start without errors

## 🚀 Next Steps

After setting up environment variables:

1. **Install backend dependencies:**
   ```bash
   npm run backend:install
   ```

2. **Start development servers:**
   ```bash
   npm run start:dev
   ```

3. **Test the connection:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001/health
   - API: http://localhost:3001/api/equipment

## 📚 Additional Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Supabase API Keys](https://supabase.com/docs/guides/api/api-keys)
- [Node.js Environment Variables](https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs)
