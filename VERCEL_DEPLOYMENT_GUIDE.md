# Vercel Deployment Guide for Travel Carbon Tracker

## Step 1: Download Your Code

1. **Download from Replit:**
   - Go to your Replit project
   - Click on the three dots menu (⋮) in the top right
   - Select "Download as ZIP"
   - Extract the ZIP file to your computer

## Step 2: Setup Neon Database (Free PostgreSQL)

1. **Create Neon Account:**
   - Go to [https://neon.tech](https://neon.tech)
   - Sign up for a free account
   - Create a new project
   - Choose a region close to you

2. **Get Database URL:**
   - In your Neon dashboard, go to "Connection Details"
   - Copy the "Connection string" (it looks like: `postgresql://username:password@host/database`)
   - Save this - you'll need it for Vercel

3. **Setup Database Schema:**
   - In your local project folder, create a `.env` file
   - Add: `DATABASE_URL=your_neon_connection_string_here`
   - Run: `npm install` (install dependencies)
   - Run: `npm run db:push` (creates the tables)

## Step 3: Deploy to Vercel

1. **Login to Vercel:**
   - Go to [https://vercel.com](https://vercel.com)
   - Sign in with your account

2. **Import Project:**
   - Click "New Project"
   - Select "Import Git Repository"
   - Choose "Continue with GitHub/GitLab" or upload your folder
   - If using GitHub: push your code to a new repository first

3. **Configure Project:**
   - **Project Name:** `travel-carbon-tracker` (or your choice)
   - **Framework Preset:** "Other" (Vercel will auto-detect)
   - **Root Directory:** Leave as `.` (dot)
   - **Build Command:** `npm run build`
   - **Install Command:** `npm install`

4. **Environment Variables:**
   - In "Environment Variables" section, add:
     - **Name:** `DATABASE_URL`
     - **Value:** Your Neon connection string
     - **Name:** `VITE_GOOGLE_MAPS_API_KEY`
     - **Value:** Your Google Maps API key (if you have one)

5. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)
   - You'll get a live URL like: `https://travel-carbon-tracker-xyz.vercel.app`

## Step 4: Setup Google Maps API Key (Optional)

1. **Get API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project or select existing
   - Enable "Geocoding API"
   - Go to Credentials → Create Credentials → API Key

2. **Secure Your API Key:**
   - Click on your API key to edit
   - Under "Application restrictions" → "HTTP referrers"
   - Add your Vercel URL: `https://your-app-name.vercel.app/*`

3. **Add to Vercel:**
   - In Vercel dashboard, go to your project
   - Settings → Environment Variables
   - Add: `VITE_GOOGLE_MAPS_API_KEY` with your API key
   - Redeploy the project

## Step 5: Test Your Deployment

1. **Visit Your Live App:**
   - Open the Vercel URL in your browser
   - Test the form: fill out basic info, add travel segments
   - Submit a test itinerary

2. **Share with Team:**
   - Copy the Vercel URL
   - Share with your team members
   - They can access it from any device

## Troubleshooting

**Build Fails:**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Verify environment variables are set

**Database Connection Error:**
- Verify DATABASE_URL is correct
- Check if Neon database is running
- Ensure you ran `npm run db:push`

**Location Search Not Working:**
- Check if VITE_GOOGLE_MAPS_API_KEY is set
- Verify API key has correct permissions
- Check API key restrictions match your domain

## Cost Breakdown (All Free!)

- **Vercel:** Free tier (100GB bandwidth, enough for 1000+ users)
- **Neon Database:** Free tier (20GB storage, plenty for your data)
- **Google Maps API:** Free tier ($200 credit monthly, covers 40,000+ requests)

Your total cost: **$0/month** for 30-50 users!

## Support

If you run into issues:
1. Check Vercel build logs
2. Verify environment variables
3. Test database connection
4. Check Google Maps API quotas

Your app will be live at: `https://your-project-name.vercel.app`