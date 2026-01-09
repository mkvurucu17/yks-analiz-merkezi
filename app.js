import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDbc7m-zB3KmgKgsACKwDJFMUT3pQYbONs",
    authDomain: "yks-analiz-merkezi.firebaseapp.com",
    projectId: "yks-analiz-merkezi",
    storageBucket: "yks-analiz-merkezi.firebasestorage.app",
    messagingSenderId: "985219990894",
    appId: "1:985219990894:web:802f31c78060bdd1c6ad7f",
    measurementId: "G-N6E47G9KVX"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// KONU LİSTESİ (Örnek - subjects.json'a taşıyacağız)
const subjects = ["Temel Kavramlar", "Sayı Basamakları", "Rasyonel Sayılar", "Trigonometri", "Limit", "Türev"];
let selectedMistakes = [];

// ARAMA VE FİLTRELEME MANTIĞI
window.filterSubjects = function() {
    const input = document.getElementById('subjectSearch').value.toLowerCase();
    const sugBox = document.getElementById('searchSuggestions');
    sugBox.innerHTML = '';
    
    if(input.length < 1) return;

    const filtered = subjects.filter(s => s.toLowerCase().includes(input));
    filtered.forEach(s => {
        const item = document.createElement('div');
        item.innerText = s;
        item.onclick = () => addSubject(s);
        sugBox.appendChild(item);
    });
}

function addSubject(s) {
    if(!selectedMistakes.includes(s)) {
        selectedMistakes.push(s);
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.innerText = s;
        document.getElementById('selectedSubjects').appendChild(tag);
    }
    document.getElementById('subjectSearch').value = '';
    document.getElementById('searchSuggestions').innerHTML = '';
}

// GİRİŞ/ÇIKIŞ KONTROLÜ
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('app-container').style.display = 'flex';
    } else {
        document.getElementById('auth-container').style.display = 'flex';
        document.getElementById('app-container').style.display = 'none';
    }
});

// Kayıt Butonu
document.getElementById('signUpBtn').onclick = () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    createUserWithEmailAndPassword(auth, email, pass).catch(err => alert(err.message));
};

// Giriş Butonu
document.getElementById('loginBtn').onclick = () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    signInWithEmailAndPassword(auth, email, pass).catch(err => alert(err.message));
};