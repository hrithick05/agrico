# 🚀 Complete Deployment Guide: Backend (Render) + Frontend (Vercel)

## 📋 Overview
This guide will help you deploy:
- **Backend** → Render (Node.js/Express API)
- **Frontend** → Vercel (React/Vite SPA)

---

## 🔧 Part 1: Backend Deployment to Render

### Step 1: Deploy Backend to Render

1. **Go to [Render Dashboard](https://dashboard.render.com/)**
2. **Sign up/Login** with your GitHub account
3. **Click "New +" → "Web Service"**
4. **Connect your GitHub repository:** `hrithick05/agrico`
5. **Configure the service:**

   **Basic Settings:**
   - **Name:** `agroconnect-backend`
   - **Environment:** `Node`
   - **Region:** Choose closest to your users
   - **Branch:** `main`
   - **Root Directory:** `server`

   **Build & Deploy:**
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

### Step 2: Set Environment Variables in Render

In Render dashboard → Your service → Environment tab:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3001` |
| `SUPABASE_URL` | `https://ycorozkbfeqwybujwnaz.supabase.co` |
| `SUPABASE_SERVICE_KEY` | `[Your actual Supabase service key]` |
| `FRONTEND_URL` | `https://your-vercel-app.vercel.app` |

### Step 3: Get Your Supabase Service Key

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the **service_role** key (not the anon key)
5. Paste it as `SUPABASE_SERVICE_KEY` in Render

### Step 4: Deploy and Test

1. **Click "Create Web Service"**
2. **Wait for deployment** (2-5 minutes)
3. **Your backend URL:** `https://agroconnect-backend.onrender.com`
4. **Test endpoints:**
   - Health: `https://agroconnect-backend.onrender.com/health`
   - API: `https://agroconnect-backend.onrender.com/`

---

## 🎨 Part 2: Frontend Deployment to Vercel

### Step 1: Deploy Frontend to Vercel

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Sign up/Login** with your GitHub account
3. **Click "New Project"**
4. **Import your GitHub repository:** `hrithick05/agrico`
5. **Configure the project:**

   **Project Settings:**
   - **Framework Preset:** `Vite`
   - **Root Directory:** `./` (root of repository)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

### Step 2: Set Environment Variables in Vercel

In Vercel dashboard → Your project → Settings → Environment Variables:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://agroconnect-backend.onrender.com/api` |
| `VITE_SUPABASE_URL` | `https://ycorozkbfeqwybujwnaz.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `[Your Supabase anon key]` |

### Step 3: Get Your Supabase Anon Key

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the **anon/public** key
5. Paste it as `VITE_SUPABASE_ANON_KEY` in Vercel

### Step 4: Deploy and Test

1. **Click "Deploy"**
2. **Wait for deployment** (2-3 minutes)
3. **Your frontend URL:** `https://agrico-git-main-hrithick05.vercel.app`
4. **Test your application**

---

## 🔄 Part 3: Update CORS Configuration

### Update Backend CORS

After deploying both services, update your backend CORS to allow your Vercel domain:

1. **In Render dashboard:**
   - Go to your backend service
   - Environment tab
   - Update `FRONTEND_URL` to your actual Vercel URL
   - Redeploy the service

### Update Frontend API URL

1. **In Vercel dashboard:**
   - Go to your project
   - Settings → Environment Variables
   - Update `VITE_API_URL` to your actual Render backend URL

---

## 🧪 Part 4: Testing Your Deployment

### Test Backend
```bash
# Health check
curl https://agroconnect-backend.onrender.com/health

# API endpoints
curl https://agroconnect-backend.onrender.com/api/equipment
curl https://agroconnect-backend.onrender.com/api/forum
```

### Test Frontend
1. Visit your Vercel URL
2. Test all features:
   - Equipment browsing
   - Forum posts
   - Banking information
   - Schemes
   - Language switching

---

## 🔧 Troubleshooting

### Common Issues:

#### Backend Issues:
1. **Build fails:** Check all dependencies are in package.json
2. **Service won't start:** Verify environment variables
3. **CORS errors:** Update FRONTEND_URL in Render
4. **Database connection:** Check Supabase service key

#### Frontend Issues:
1. **Build fails:** Check Vite configuration
2. **API calls fail:** Verify VITE_API_URL is correct
3. **Supabase errors:** Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

### Free Tier Limitations:

#### Render (Backend):
- Sleeps after 15 minutes of inactivity
- Cold start takes 30-60 seconds
- 750 hours per month

#### Vercel (Frontend):
- 100GB bandwidth per month
- Unlimited deployments
- Custom domains available

---

## 📊 Monitoring & Maintenance

### Render Monitoring:
- Automatic HTTPS
- Health checks
- Deployment logs
- Performance metrics

### Vercel Monitoring:
- Automatic HTTPS
- Global CDN
- Performance analytics
- Deployment previews

---

## 🚀 Next Steps

1. **Set up custom domains** (optional)
2. **Configure CI/CD** for automatic deployments
3. **Set up monitoring** and alerts
4. **Optimize performance** for production

---

## 📞 Support

- **Render Documentation:** https://render.com/docs
- **Vercel Documentation:** https://vercel.com/docs
- **Supabase Documentation:** https://supabase.com/docs

---

## 🎉 Success Checklist

- ✅ Backend deployed to Render
- ✅ Frontend deployed to Vercel
- ✅ Environment variables configured
- ✅ CORS settings updated
- ✅ All endpoints tested
- ✅ Application fully functional
