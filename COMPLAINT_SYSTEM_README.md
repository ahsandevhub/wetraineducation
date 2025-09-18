# WeTrain Education - Anonymous Complaint System

## 🚀 Quick Setup Guide

### Prerequisites

You'll need MongoDB running for the complaint system to work. Choose one of these options:

### Option 1: Local MongoDB Installation

1. **Download MongoDB Community Server**: https://www.mongodb.com/try/download/community
2. **Install and start MongoDB service**
3. **Keep the current MONGODB_URI**: `mongodb://localhost:27017/wetraineducation`

### Option 2: MongoDB Atlas (Cloud - Recommended)

1. **Create free account**: https://www.mongodb.com/cloud/atlas
2. **Create a free cluster**
3. **Get connection string** and replace MONGODB_URI in `.env.local`
4. **Example**: `mongodb+srv://username:password@cluster.mongodb.net/wetraineducation`

### Option 3: Quick Docker Setup

```bash
# Pull and run MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Wait a few seconds, then create admin
npm run create-admin
```

## 🔧 Setup Steps

1. **Configure MongoDB** (choose option above)
2. **Create admin user**:
   ```bash
   npm run create-admin
   ```
3. **Start development server**:
   ```bash
   npm run dev
   ```

## 📍 Access URLs

- **Anonymous Complaint Form**: http://localhost:3000/complaint
- **Admin Portal**: http://localhost:3000/admin
- **Admin Login Credentials**:
  - Username: `admin`
  - Password: `admin123`

## 🔑 Features

### Anonymous Complaint System (`/complaint`)

- ✅ Completely anonymous submission
- ✅ Team member selection dropdown
- ✅ Rich text editor with formatting
- ✅ Text anonymization tools:
  - Normalize writing patterns
  - Scramble word structure
  - Fix capitalization consistency
- ✅ Rate limiting (3 complaints per 15 minutes per IP)
- ✅ Input validation and security

### Admin Portal (`/admin`)

- ✅ Secure login with NextAuth
- ✅ View all complaints in paginated dashboard
- ✅ Filter by team member or read status
- ✅ Mark complaints as read/unread
- ✅ Full complaint detail modal
- ✅ Role-based permissions (super-admin can delete)
- ✅ Responsive design

## 🛡️ Privacy & Security

- **Zero tracking**: No identifying information collected
- **IP anonymization**: IPs not exposed in admin panel
- **Text obfuscation**: Multiple tools to hide writing style
- **Rate limiting**: Prevents spam and abuse
- **Secure authentication**: Encrypted passwords, JWT sessions
- **Input validation**: All inputs sanitized and validated

## 🔧 Environment Variables

Update `.env.local` with your settings:

```env
# MongoDB (choose one)
MONGODB_URI=mongodb://localhost:27017/wetraineducation
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/wetraineducation

# NextAuth (already configured)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=d465a354210992117c0e12a7c37564d313a3ffefb4e7da3e16c5fe09cd283c62

# Admin credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_EMAIL=admin@wetraineducation.com
```

## 🚨 Current Issues Fixed

✅ **Mongoose duplicate index warnings** - Removed duplicate indexes  
✅ **NextAuth JWT decryption errors** - Added proper secret key  
✅ **Session configuration** - Added proper JWT timeouts

## 📱 Usage Instructions

### For Employees (Anonymous):

1. Visit `/complaint` (share link or create QR code)
2. Select team member from dropdown
3. Write complaint using rich text editor
4. Use text formatting tools to anonymize writing style:
   - **Normalize Text**: Removes personal writing patterns
   - **Scramble**: Randomly rearranges letters in words
   - **Fix Case**: Standardizes capitalization
5. Submit complaint anonymously

### For Administrators:

1. Visit `/admin` and login with credentials
2. Dashboard shows all complaints with filters
3. Click "View" for full complaint details
4. Mark complaints as read/unread for tracking
5. Super-admins can delete complaints if needed

## 🎯 Production Deployment

For production deployment:

1. Use MongoDB Atlas or dedicated MongoDB server
2. Generate new `NEXTAUTH_SECRET`: `openssl rand -base64 32`
3. Update `NEXTAUTH_URL` to your domain
4. Create proper admin credentials
5. Enable HTTPS and security headers
6. Configure proper CORS and CSP policies

The system is now ready for testing with MongoDB!
