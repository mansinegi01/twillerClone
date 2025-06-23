
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCVYJ3BSGCKL5sGBoYmJT3Q3pMaCrYQhtI",
  authDomain: "twiller-9418f.firebaseapp.com",
  projectId: "twiller-9418f",
  storageBucket: "twiller-9418f.firebasestorage.app",
  messagingSenderId: "695577454883",
  appId: "1:695577454883:web:5fd72d41084ee23f860496",
  measurementId: "G-VR8C1H17M1"
};

const app = initializeApp(firebaseConfig);
export const auth=getAuth(app)
export default app
// const analytics = getAnalytics(app);
