// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmhFIQ9B2yBl5nPVtMa-eqdMnqoM2Yue4",
  authDomain: "cse370-project-b5d43.firebaseapp.com",
  projectId: "cse370-project-b5d43",
  storageBucket: "cse370-project-b5d43.appspot.com",
  messagingSenderId: "28700359589",
  appId: "1:28700359589:web:742469404dcdf3e50fc64c",
};

// Initialize Firebase
const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const storage = firebase.storage();

export { storage, firebase as default };
