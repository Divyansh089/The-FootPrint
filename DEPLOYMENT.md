# Deployment Guide for The FootPrint Backend

## Environment Setup

### For Production Deployment (Render, Vercel, etc.)

#### 1. Environment Variables Required:
```bash
# Database
MONGODB_URI=your-mongodb-atlas-connection-string

# Server
PORT=10000  # Or whatever port your platform assigns
NODE_ENV=production

# Optional: Pinata for IPFS
PINATA_API_KEY=your-pinata-api-key
PINATA_API_SECRET=your-pinata-secret-key

# Security
METADATA_SIGNING_SECRET=your-secure-random-string
```

#### 2. Build Commands:
```bash
# For platforms like Render:
Build Command: npm run build:production
Start Command: npm run start

# For manual deployment:
npm install
npm run build
npm start
```

#### 3. MongoDB Setup Options:

**Option A: MongoDB Atlas (Recommended)**
1. Create a free MongoDB Atlas account
2. Create a new cluster
3. Get connection string and set as MONGODB_URI
4. Whitelist your deployment platform's IPs

**Option B: Local/Self-hosted MongoDB**
1. Install MongoDB on your server
2. Set MONGODB_URI=mongodb://localhost:27017/footprint-evidence

**Option C: No Database (Fallback Mode)**
- The app will run without persistent storage
- Data will be lost on restart
- Suitable for demos/testing

## Frontend Environment Update

Update your frontend's .env.local:
```bash
# For local development
NEXT_PUBLIC_API_BASE=http://localhost:4001

# For production (update with your deployed backend URL)
NEXT_PUBLIC_API_BASE=https://your-backend-domain.com
```

## Common Deployment Issues & Solutions

### Issue 1: MongoDB Connection Timeout
**Solution**: Use MongoDB Atlas or ensure MongoDB is properly installed and running

### Issue 2: Port Already in Use
**Solution**: The app automatically uses PORT environment variable from the platform

### Issue 3: CORS Issues
**Solution**: Add your frontend domain to ALLOWED_ORIGINS environment variable

### Issue 4: Build Failures
**Solution**: Ensure all dependencies are in package.json, not just devDependencies

## Deployment Platform Specific

### Render.com
1. Connect your GitHub repository
2. Set build command: `npm run build:production`
3. Set start command: `npm start`
4. Add environment variables in Render dashboard

### Vercel (Serverless)
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`
3. Set environment variables in Vercel dashboard

### Railway
1. Connect GitHub repository
2. Set PORT environment variable if needed
3. Add MongoDB connection string

### Heroku
1. Create Heroku app
2. Set buildpack to Node.js
3. Configure environment variables
4. Deploy from GitHub or CLI

## Testing Deployment

1. Health check endpoint: `GET /api/health`
2. Test evidence submission: `POST /api/evidence`
3. Check logs for any connection errors

## Security Considerations

- Always use HTTPS in production
- Set strong METADATA_SIGNING_SECRET
- Use MongoDB Atlas with authentication
- Regularly update dependencies
- Monitor for security vulnerabilities
