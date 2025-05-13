// Configura tu Firebase aquí:
const firebaseConfig = {
  apiKey: "AIzaSyAGKCyc3_Libolw6IVsg3UwuIs1iAyrUBU",
  authDomain: "roomieversity.firebaseapp.com",
  projectId: "roomieversity",
  storageBucket: "roomieversity.firebasestorage.app",
  messagingSenderId: "653991415866",
  appId: "1:653991415866:web:2eea44639b20a19b91e503",
  measurementId: "G-086XNBE4F1"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Registro
async function register() {
  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const type = document.getElementById("registerType").value;

  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    await db.collection("users").doc(user.uid).set({
      name: name,
      type: type
    });

    alert("Registro exitoso. Ahora puedes iniciar sesión.");
  } catch (error) {
    alert(error.message);
  }
}

// Login
async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    const doc = await db.collection("users").doc(user.uid).get();
    const userData = doc.data();

    document.getElementById("register").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("welcome").style.display = "block";
    document.getElementById("welcomeText").innerText =
      `¡Bienvenido, ${userData.name}! Eres un ${userData.type}.`;

  } catch (error) {
    alert(error.message);
  }
}

// Logout
function logout() {
  auth.signOut().then(() => {
    document.getElementById("register").style.display = "block";
    document.getElementById("login").style.display = "block";
    document.getElementById("welcome").style.display = "none";
  });
}
