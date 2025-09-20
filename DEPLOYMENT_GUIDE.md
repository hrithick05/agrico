# 🚀 Deployment Guide for AgroConnect Backend

## Deploying to Render

### Prerequisites
1. A GitHub repository with your code
2. A Render account (free tier available)
3. Your Supabase credentials

### Step 1: Prepare Your Repository

1. **Commit all changes to your repository:**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

### Step 2: Deploy to Render

1. **Go to [Render Dashboard](https://dashboard.render.com/)**
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure your service:**

   **Basic Settings:**
   - **Name:** `agroconnect-backend`
   - **Environment:** `Node`
   - **Region:** Choose closest to your users
   - **Branch:** `main` (or your default branch)
   - **Root Directory:** `server`

   **Build & Deploy:**
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

   **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=3001
   SUPABASE_URL=https://ycorozkbfeqwybujwnaz.supabase.co
   SUPABASE_SERVICE_KEY=your-actual-service-key-here
   FRONTEND_URL=https://your-frontend-domain.com
   ```

### Step 3: Configure Environment Variables

**Important:** Replace `your-actual-service-key-here` with your real Supabase service key.

1. **In Render Dashboard:**
   - Go to your service
   - Click "Environment"
   - Add the following variables:

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `PORT` | `3001` |
   | `SUPABASE_URL` | `https://ycorozkbfeqwybujwnaz.supabase.co` |
   | `SUPABASE_SERVICE_KEY` | `[Your actual service key]` |
   | `FRONTEND_URL` | `[Your frontend URL]` |

### Step 4: Deploy

1. **Click "Create Web Service"**
2. **Wait for deployment to complete** (usually 2-5 minutes)
3. **Your backend will be available at:** `https://your-service-name.onrender.com`

### Step 5: Test Your Deployment

1. **Health Check:** Visit `https://your-service-name.onrender.com/health`
2. **API Root:** Visit `https://your-service-name.onrender.com/`
3. **Test endpoints:** Try your API endpoints

### Step 6: Update Frontend Configuration

Update your frontend to use the new backend URL:

```javascript
// In your frontend API configuration
const API_BASE_URL = 'https://your-service-name.onrender.com';
```

## 🔧 Troubleshooting

### Common Issues:

1. **Build Fails:**
   - Check that all dependencies are in `package.json`
   - Ensure Node.js version compatibility

2. **Service Won't Start:**
   - Check environment variables are set correctly
   - Verify Supabase credentials
   - Check logs in Render dashboard

3. **CORS Issues:**
   - Update `FRONTEND_URL` environment variable
   - Ensure your frontend domain is correct

### Render Free Tier Limitations:

- **Sleep after 15 minutes of inactivity**
- **Cold start takes 30-60 seconds**
- **750 hours per month**

### Upgrading to Paid Plan:

For production use, consider upgrading to:
- **Starter Plan ($7/month):** Always-on, custom domains
- **Professional Plan ($25/month):** Better performance, more resources

## 📝 Additional Configuration

### Custom Domain (Paid Plans):

1. **In Render Dashboard:**
   - Go to your service
   - Click "Settings" → "Custom Domains"
   - Add your domain
   - Update DNS records as instructed

### Environment-Specific Configuration:

For different environments (staging, production), create separate Render services with different environment variables.

## 🔒 Security Notes

1. **Never commit sensitive keys to Git**
2. **Use environment variables for all secrets**
3. **Regularly rotate your Supabase service keys**
4. **Enable HTTPS (automatic on Render)**

## 📊 Monitoring

Render provides:
- **Automatic HTTPS**
- **Health checks**
- **Deployment logs**
- **Performance metrics** (paid plans)

## 🆘 Support

- **Render Documentation:** https://render.com/docs
- **Render Support:** https://render.com/support
- **Your Service Logs:** Available in Render dashboard
