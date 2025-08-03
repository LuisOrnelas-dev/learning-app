# Deployment Configuration Guide

## Frontend (React App) - Vercel

### Environment Variables to set in Vercel Dashboard:
```
REACT_APP_API_URL=https://your-backend-url.onrender.com
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
```

### Build Command:
```
npm run build
```

### Output Directory:
```
build
```

## Backend (OpenAI Proxy) - Render

### Environment Variables to set in Render Dashboard:
```
OPENAI_API_KEY=your_openai_api_key_here
PORT=4000
```

### Build Command:
```
npm install
```

### Start Command:
```
node index.js
```

## Deployment Steps:

1. **Push code to GitHub**
2. **Deploy Backend first** (Render)
3. **Get Backend URL** from Render
4. **Update Frontend environment** with Backend URL
5. **Deploy Frontend** (Vercel) 