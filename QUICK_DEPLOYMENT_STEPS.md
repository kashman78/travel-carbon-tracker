# Quick Vercel Deployment Steps

## 🚀 Ready to Deploy!

Your travel form is now configured for Vercel deployment. Here's what to do:

### Step 1: Download Your Code
1. In this Replit project, click the **⋮** menu (top right)
2. Select **"Download as ZIP"**
3. Extract the ZIP file to your computer

### Step 2: Set Up Free Database
1. Go to **[neon.tech](https://neon.tech)** and create a free account
2. Create a new project
3. Copy the connection string (looks like: `postgresql://user:pass@host/db`)

### Step 3: Deploy to Vercel
1. Go to **[vercel.com](https://vercel.com)** and sign in
2. Click **"New Project"**
3. Upload your project folder or connect to GitHub
4. In **Environment Variables**, add:
   - `DATABASE_URL` = your Neon connection string
   - `VITE_GOOGLE_MAPS_API_KEY` = your Google Maps API key (optional)
5. Click **"Deploy"**

### Step 4: Set Up Database Tables
1. In your local project folder, create `.env` file with your DATABASE_URL
2. Run: `npm install`
3. Run: `npm run db:push`

### Step 5: Test and Share
1. Visit your live Vercel URL
2. Test the form
3. Share the URL with your team

## 💰 Cost: $0/month
- Vercel: Free tier (more than enough for 50 users)
- Neon Database: Free tier (20GB storage)
- Google Maps API: Free tier ($200 credit monthly)

## 📋 Files I've Created for You:
- `vercel.json` - Vercel configuration
- `VERCEL_DEPLOYMENT_GUIDE.md` - Detailed instructions
- `.env.example` - Environment variables template

## 🆘 Need Help?
Check the detailed guide in `VERCEL_DEPLOYMENT_GUIDE.md` for troubleshooting and complete instructions.

Your app will be live at: `https://your-project-name.vercel.app`