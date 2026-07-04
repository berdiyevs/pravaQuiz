import { auth, googleProvider, db } from "../../firebase-config.js";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import {
  doc,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// --- ELEMENTLAR ---
const modal = document.getElementById("loginModal");
const openBtn = document.getElementById("openModal");
const closeBtn = document.querySelector(".close-btn");

// --- FUNKSIYALAR ---

// Inputlarni tozalash
const clearInputs = () => {
  document
    .querySelectorAll(".custom-input")
    .forEach((input) => (input.value = ""));
};

// Ro'yxatdan o'tish
const signUpWithEmail = async () => {
  const name = document.getElementById("nameInput")?.value;
  const email = document.getElementById("emailInput")?.value;
  const password = document.getElementById("passInput")?.value;

  if (!email || !password || !name) {
    alert("Iltimos, ism, email va parolni to'ldiring!");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    await sendEmailVerification(user);

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      displayName: name,
      email: user.email,
      isVerified: false,
      createdAt: serverTimestamp(),
    });

    alert(
      "Ro'yxatdan o'tdingiz! Tasdiqlash xati yuborildi. Iltimos, pochtangizni tekshiring.",
    );
    await signOut(auth);
    modal.style.display = "none";
    clearInputs();
  } catch (error) {
    alert("SignUp xatosi: " + error.message);
  }
};

// Kirish
const loginWithEmail = async () => {
  const email = document.getElementById("emailInput")?.value;
  const password = document.getElementById("passInput")?.value;

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    if (user.emailVerified) {
      window.location.href = "src/html/categories.html";
    } else {
      alert("Avval emailingizni tasdiqlang! Link yuborilgan.");
      await signOut(auth);
    }
  } catch (error) {
    alert("Email yoki parol noto'g'ri!");
  }
};

// Google bilan kirish
const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    await setDoc(
      doc(db, "users", user.uid),
      {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        lastLogin: serverTimestamp(),
      },
      { merge: true },
    );

    window.location.href = "src/html/categories.html";
  } catch (error) {
    console.error("Google xatosi:", error);
  }
};

// --- EVENT LISTENERS ---

window.addEventListener("DOMContentLoaded", () => {
  // Modalni ochish
  openBtn?.addEventListener("click", () => {
    modal.style.display = "block";
  });

  // Modalni yopish (X tugmasi)
  closeBtn?.addEventListener("click", () => {
    modal.style.display = "none";
    clearInputs();
  });

  // Modal tashqarisiga bosilganda yopish
  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
      clearInputs();
    }
  });

  // Firebase tugmalari
  document
    .getElementById("googleLoginBtn")
    ?.addEventListener("click", loginWithGoogle);
  document
    .getElementById("signUpBtn")
    ?.addEventListener("click", signUpWithEmail);
  document
    .getElementById("loginBtn")
    ?.addEventListener("click", loginWithEmail);
});