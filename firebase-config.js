// ─── Firebase project configuration ─────────────────────────────
// TODO: Replace with your real config from:
// Firebase Console → Project settings (gear icon) → General → "Your apps" → Web app (</>)
const firebaseConfig = {
  apiKey: "AIzaSyCT_TZay97l4VS0fuPDfCOBgtmJZrKWxsY",
  authDomain: "suvikalp-testimonials.firebaseapp.com",
  projectId: "suvikalp-testimonials",
  storageBucket: "suvikalp-testimonials.firebasestorage.app",
  messagingSenderId: "561899501506",
  appId: "1:561899501506:web:3f6fa4018a4b24e7a0085b"
};

// TODO: Email address(es) allowed to sign in to admin.html.
// Must match the user you create in Firebase Console → Authentication → Users → Add user.
const ADMIN_EMAILS = [
  "rkcdeloitte@gmail.com"
];

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
