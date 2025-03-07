# Chat Application

A simple real-time chat application built with React.js and Firebase.

## Features

- User authentication (sign up, login, logout)
- Real-time messaging
- Clean and responsive UI with ShadCN UI components

## Tech Stack

- React.js
- Firebase (Authentication & Firestore)
- ShadCN UI
- React Router

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm
- Firebase account

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/deepnet-chat-app.git
   cd chat-app
   ```

2. Install dependencies:

   ```sh
   pnpm install
   ```

3. Copy the environment variables file:

   ```sh
   cp .env.example .env
   ```

4. Create a Firebase project:

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Set up Authentication with Email/Password
   - Create a Firestore database

5. Configure Firebase:

   - In the Firebase console, go to Project Settings
   - Add a web app to your project
   - Copy the Firebase configuration
   - Replace all values in the `.env` file with your own Firebase credentials

   ```
   VITE_FIREBASE_API_KEY=
   VITE_FIREBASE_AUTH_DOMAIN=
   VITE_FIREBASE_PROJECT_ID=
   VITE_FIREBASE_STORAGE_BUCKET=
   VITE_FIREBASE_MESSAGING_SENDER_ID=
   VITE_FIREBASE_APP_ID=
   VITE_FIREBASE_MEASUREMENT_ID=
   ```

6. Start the development server:

   ```sh
   pnpm run dev
   ```

7. Open your browser and go to `http://localhost:3000`

## Firestore Database Structure

The app uses a simple Firestore structure:

```plaintext
messages (collection)
  - message (document)
    - createdAt: timestamp
    - text: string
    - userEmail: string (user email)
    - userId: string (user ID)
```

## Live Link:
(https://deepnet-chat.netlify.app/)
