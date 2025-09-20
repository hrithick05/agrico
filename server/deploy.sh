#!/bin/bash

# AgroConnect Backend Deployment Script for Render

echo "🚀 Starting AgroConnect Backend Deployment..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not initialized. Please run 'git init' first."
    exit 1
fi

# Check if we're in the server directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the server directory."
    exit 1
fi

# Add all files to git
echo "📁 Adding files to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy to Render - $(date)"

# Push to main branch
echo "🚀 Pushing to main branch..."
git push origin main

echo "✅ Deployment initiated! Check your Render dashboard for progress."
echo "🔗 Your backend will be available at: https://your-service-name.onrender.com"
echo ""
echo "📝 Don't forget to:"
echo "   1. Set environment variables in Render dashboard"
echo "   2. Update your frontend API URL"
echo "   3. Test your deployed endpoints"
