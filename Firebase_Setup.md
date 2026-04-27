# Firebase Setup Instructions

The app is currently using a **Mock Firebase** setup in `src/context/AuthContext.jsx` so that it runs flawlessly out-of-the-box for your presentation without requiring immediate backend configuration. 

When you are ready to connect to a real Firebase project, follow these steps:

## 1. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and follow the prompts.
3. Enable **Authentication** (Email/Password provider).
4. Enable **Firestore Database** (Start in Test Mode).

## 2. Get Your Config
1. In the Firebase console, go to **Project Settings**.
2. Scroll down to your apps and click the **Web `</>`** icon to add a web app.
3. Copy the `firebaseConfig` object provided.

## 3. Implement in Code
Create a file named `src/firebase.js`:
```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

Then, update the functions in `src/context/AuthContext.jsx` to use the imported `auth` and `db` from `firebase.js` instead of the `localStorage` mock functions.
