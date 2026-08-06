// ─── Firebase project configuration ─────────────────────────────
// TODO: Replace with your real config from:
// Firebase Console → Project settings (gear icon) → General → "Your apps" → Web app (</>)
const firebaseConfig = {
  apiKey: "AIzaSyDrtpNj5sk7zUnUZ5mCbL7akNVTIPcHvis",
  authDomain: "suvikalp-testimonials-6b0c5.firebaseapp.com",
  projectId: "suvikalp-testimonials-6b0c5",
  storageBucket: "suvikalp-testimonials-6b0c5.firebasestorage.app",
  messagingSenderId: "1077025207566",
  appId: "1:1077025207566:web:2708a2db1007a79b8fd35f"
};

// TODO: Email address(es) allowed to sign in to admin.html.
// Must match the user you create in Firebase Console → Authentication → Users → Add user.
const ADMIN_EMAILS = [
  "nirutpal.cco@gov.in"
];

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
