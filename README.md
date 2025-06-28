# 📝 MERN Blog Platform

A modern, full-featured blogging platform built with the MERN stack (MongoDB, Express.js, React, Node.js). This project demonstrates production-ready code with authentication, CRUD operations, search functionality, and a beautiful responsive UI.

## 🚀 Live Demo

[Live Demo](https://your-demo-url.com) | [API Documentation](https://your-api-docs.com)

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **React Hot Toast** for notifications
- **React Markdown** for content rendering
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **Helmet** for security headers
- **Morgan** for logging
- **CORS** for cross-origin requests

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Secure password hashing with bcrypt
- Protected routes and middleware
- User registration and login
- Persistent login sessions

### 📝 Blog Management
- Create, read, update, delete blog posts
- Rich text content with Markdown support
- Post drafts and publishing
- Tag-based categorization
- Post summaries and metadata

### 🔍 Search & Discovery
- Full-text search across posts
- Tag-based filtering
- Popular tags display
- Advanced search with MongoDB aggregation
- Real-time search suggestions

### 👤 User System
- User profiles with avatars and bio
- Personal dashboard with analytics
- Post management interface
- User-specific post feeds
- Author profiles and post listings

### 📊 Analytics & Engagement
- Post view tracking
- Like/unlike functionality
- Comment system
- Dashboard with statistics
- Recent posts overview

### 🎨 Modern UI/UX
- Responsive design for all devices
- Clean, professional interface
- Smooth animations and transitions
- Dark mode support (optional)
- Accessible design patterns

## 📂 Project Structure

```
mern-blog-platform/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── postController.js
│   │   ├── searchController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Post.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── posts.js
│   │   ├── search.js
│   │   └── user.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   ├── Blog/
│   │   │   └── ProtectedRoute.tsx
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── PostDetail.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.ts
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mern-blog-platform.git
   cd mern-blog-platform
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   Backend (.env):
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/mern-blog
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   ```

   Frontend (.env):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both frontend (http://localhost:5173) and backend (http://localhost:5000) servers.

### Building for Production

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   cd backend && npm start
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post (protected)
- `PUT /api/posts/:id` - Update post (protected)
- `DELETE /api/posts/:id` - Delete post (protected)
- `PUT /api/posts/:id/like` - Like/unlike post (protected)

### Search
- `GET /api/search/posts` - Search posts
- `GET /api/search/tags` - Get popular tags
- `GET /api/search/tags/:tag` - Get posts by tag

### Users
- `PUT /api/users/profile` - Update user profile (protected)
- `GET /api/users/profile/:id` - Get user profile
- `GET /api/users/dashboard` - Get user dashboard (protected)

## 🚀 Deployment

### Frontend (Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `frontend/dist` folder to Netlify
3. Set environment variables in Netlify dashboard

### Backend (Render/Railway)
1. Create a new service on Render or Railway
2. Connect your GitHub repository
3. Set environment variables
4. Deploy the backend folder

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Get the connection string
3. Update the `MONGODB_URI` environment variable

## 🧪 Testing

```bash
# Run backend tests
cd backend && npm test

# Run frontend tests
cd frontend && npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Portfolio: [yourportfolio.com](https://yourportfolio.com)

## 🙏 Acknowledgments

- [React](https://reactjs.org/) for the amazing frontend framework
- [Express.js](https://expressjs.com/) for the robust backend framework
- [MongoDB](https://www.mongodb.com/) for the flexible database
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide React](https://lucide.dev/) for the beautiful icons

---

⭐ Star this repository if you found it helpful!