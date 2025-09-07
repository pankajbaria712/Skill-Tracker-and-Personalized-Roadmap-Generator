# Skill Tracker and Personalized Roadmap Generator

A comprehensive web application for tracking skills, generating personalized learning roadmaps, and managing professional development goals.

## 🚀 Features

### Frontend (React + Vite)
- **Modern UI**: Built with React, Vite, and Tailwind CSS
- **Dashboard**: Interactive skill tracking with progress visualization
- **AI-Powered Roadmaps**: Generate personalized learning paths
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Authentication**: Secure user login and registration
- **Real-time Updates**: Live progress tracking and notifications

### Backend (Node.js + Express)
- **RESTful API**: Well-structured endpoints for all operations
- **Authentication**: JWT-based secure authentication
- **Database Integration**: Firebase for data persistence
- **Skill Management**: CRUD operations for skills and progress
- **Roadmap Generation**: AI-powered personalized roadmaps

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Firebase** - Authentication and data storage

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Firebase Admin SDK** - Server-side Firebase operations
- **JWT** - JSON Web Tokens for authentication
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
skill-tracker-website/
├── skill-tracker-frontend/          # React frontend application
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── Auth/               # Authentication components
│   │   │   ├── Dashboard/          # Dashboard components
│   │   │   ├── home/               # Landing page components
│   │   │   └── ...
│   │   ├── contexts/               # React contexts
│   │   ├── firebase/               # Firebase configuration
│   │   ├── pages/                  # Page components
│   │   ├── utils/                  # Utility functions
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
├── skill-tracker-backend/           # Node.js backend application
│   ├── controllers/                 # Route controllers
│   ├── middleware/                  # Custom middleware
│   ├── models/                      # Data models
│   ├── routes/                      # API routes
│   ├── config/                      # Configuration files
│   ├── server.js                    # Main server file
│   └── package.json
│
└── README.md                        # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git
- Firebase project (for authentication and database)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/pankajbaria712/Skill-Tracker-and-Personalized-Roadmap-Generator.git
   cd skill-tracker-website
   ```

2. **Backend Setup**
   ```bash
   cd skill-tracker-backend
   npm install
   ```

   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY=your-private-key
   FIREBASE_CLIENT_EMAIL=your-client-email
   JWT_SECRET=your-jwt-secret
   ```

3. **Frontend Setup**
   ```bash
   cd ../skill-tracker-frontend
   npm install
   ```

   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_FIREBASE_API_KEY=your-firebase-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   ```

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication and Firestore Database
3. Generate a service account key for the backend
4. Update the environment variables with your Firebase credentials

### Running the Application

1. **Start the Backend**
   ```bash
   cd skill-tracker-backend
   npm start
   ```

2. **Start the Frontend**
   ```bash
   cd skill-tracker-frontend
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Skills
- `GET /api/skills` - Get all user skills
- `POST /api/skills` - Create new skill
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill

### Roadmaps
- `GET /api/roadmaps` - Get user roadmaps
- `POST /api/roadmaps` - Generate new roadmap
- `PUT /api/roadmaps/:id` - Update roadmap

## 🎨 UI Components

The frontend includes various reusable components:
- **Navbar**: Navigation with user menu
- **Sidebar**: Dashboard navigation
- **ProgressRing**: Circular progress indicators
- **ActivityFeed**: Recent activity display
- **RoadmapSection**: Interactive roadmap display
- **AIResourceModal**: AI-powered resource suggestions

## 🔧 Development

### Available Scripts

**Frontend:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

**Backend:**
```bash
npm start            # Start production server
npm run dev          # Start development server with nodemon
npm test             # Run tests
```

### Code Quality
- ESLint for code linting
- Prettier for code formatting
- Husky for git hooks

## 🚀 Deployment

### Frontend Deployment
```bash
cd skill-tracker-frontend
npm run build
# Deploy the dist/ folder to your hosting service
```

### Backend Deployment
```bash
cd skill-tracker-backend
npm run build
# Deploy to your preferred Node.js hosting service
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

For questions or support, please open an issue on GitHub.

## 🙏 Acknowledgments

- React community for excellent documentation
- Tailwind CSS for the amazing utility-first approach
- Firebase for seamless backend integration
- All contributors and supporters

---

**Happy Learning! 🚀**
