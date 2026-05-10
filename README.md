# 💬 ChatVerse - Real-Time Chat Application

A modern, fast, and fully functional real-time chat room application built with React, Vite, and Firebase. This project allows users to authenticate seamlessly, create custom chat rooms, and exchange real-time messages with a rich, glassmorphism-inspired UI.

---

## ✨ Features

- **Real-Time Messaging**: Built on Firebase Firestore for instant message delivery without refreshing.
- **Multiple Chat Rooms**: Users can create their own custom rooms and switch between them instantly.
- **Authentication**: Supports both Google Sign-In and Anonymous Guest login.
- **Modern UI/UX**: 
  - Sleek dark mode with glassmorphism panels.
  - Smooth micro-animations for interactions.
  - Responsive design that looks great on both desktop and mobile.
  - Auto-scrolling to the latest messages.
- **Optimized Performance**: Packaged with Vite for blazing-fast development and optimized production builds.

---

## 🛠️ Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Authentication & Firestore)
- **Styling**: Vanilla CSS with CSS Variables
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- A [Firebase](https://console.firebase.google.com/) project with **Authentication** and **Firestore Database** enabled.

### Installation

1. **Clone the repository** (or navigate to your local copy):
   ```bash
   cd "Chat Room Application"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   - Rename the `.env.example` file to `.env`.
   - Open `.env` and fill in your Firebase configuration keys:
     ```env
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

---

## 🌐 Deployment to GitHub Pages

This project is configured to be easily deployed to GitHub Pages.

1. Ensure your `.env` file is properly configured with your Firebase credentials (these must be present *before* building the app).
2. Run the automated deployment script:
   ```bash
   npm run deploy
   ```
3. Your app will be built and pushed to the `gh-pages` branch, and will be accessible via your GitHub Pages URL.

---

## 👨‍💻 Developer & Ownership

This project is developed and owned by **Salvin Sebastian**.

- **Developer**: Salvin
- **Role**: Full-Stack Integration, UI/UX Design, and Core Logic

*For any queries, issues, or contributions regarding this codebase, please refer to the repository owner.*
