# 🚀 Deployment Guide - Learning App

## 📋 Prerequisites
- GitHub account
- OpenAI API key
- Vercel account (free)
- Render account (free)

## 🔧 Step-by-Step Deployment

### 1. Push Code to GitHub
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 2. Deploy Backend (Render)

1. **Go to [Render.com](https://render.com)** and sign up/login
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Name:** `openai-proxy`
   - **Root Directory:** `openai-proxy`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
   - **Plan:** `Free`

5. **Add Environment Variables:**
   - **Key:** `OPENAI_API_KEY`
   - **Value:** Your OpenAI API key

6. **Click "Create Web Service"**
7. **Wait for deployment and copy the URL** (e.g., `https://openai-proxy-abc123.onrender.com`)

### 3. Deploy Frontend (Vercel)

1. **Go to [Vercel.com](https://vercel.com)** and sign up/login
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure the project:**
   - **Framework Preset:** `Create React App`
   - **Root Directory:** `doctor-directory`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

5. **Add Environment Variables:**
   - **Key:** `REACT_APP_API_URL`
   - **Value:** Your Render backend URL (e.g., `https://openai-proxy-abc123.onrender.com`)
   - **Key:** `REACT_APP_OPENAI_API_KEY`
   - **Value:** Your OpenAI API key

6. **Click "Deploy"**

### 4. Test the Deployment

1. **Wait for both deployments to complete**
2. **Visit your Vercel frontend URL**
3. **Test the application functionality**
4. **Check that API calls work correctly**

## 🔍 Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Make sure backend URL is correct in frontend environment
   - Check that CORS is properly configured in backend

2. **API Key Issues:**
   - Verify OpenAI API key is valid
   - Check environment variables are set correctly

3. **Build Failures:**
   - Check package.json dependencies
   - Verify build commands are correct

### Environment Variables Checklist:

**Backend (Render):**
- ✅ `OPENAI_API_KEY`
- ✅ `PORT` (auto-set)

**Frontend (Vercel):**
- ✅ `REACT_APP_API_URL`
- ✅ `REACT_APP_OPENAI_API_KEY`

## 🎉 Success!

Once deployed, your app will be available at:
- **Frontend:** `https://your-app.vercel.app`
- **Backend:** `https://your-backend.onrender.com`

## 📝 Notes

- **Free tier limits:**
  - Vercel: 100GB bandwidth/month
  - Render: 750 hours/month
- **Auto-deploy:** Both platforms will auto-deploy on git push
- **Custom domains:** Available on both platforms (paid) 