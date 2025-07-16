#!/bin/bash

echo "=== Preparing Travel Carbon Tracker for Vercel Deployment ==="

# Create necessary directories
mkdir -p dist

# Update package.json for Vercel
echo "Adding Vercel build script..."
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.scripts['vercel-build'] = 'npm run build';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

# Create .env.example for reference
cat > .env.example << 'EOF'
# Database Configuration
DATABASE_URL=postgresql://username:password@host/database

# Google Maps API (Optional)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Environment
NODE_ENV=production
EOF

echo "✅ Vercel configuration files created!"
echo "✅ Environment example file created!"
echo ""
echo "Next steps:"
echo "1. Download this project as ZIP from Replit"
echo "2. Follow the VERCEL_DEPLOYMENT_GUIDE.md file"
echo "3. Upload to Vercel with your database URL"
echo ""
echo "Your app will be ready for deployment! 🚀"