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

// Función para mostrar errores en la interfaz
function showError(message, errorElementId) {
  const errorElement = document.getElementById(errorElementId);
  errorElement.innerText = message;
}

// Limpiar mensaje de error
function clearError(errorElementId) {
  const errorElement = document.getElementById(errorElementId);
  errorElement.innerText = '';
}

// Validar contraseña: más de 6 caracteres, al menos una mayúscula, una minúscula y un número
function validatePassword(password) {
  const lengthCheck = password.length >= 6;
  const uppercaseCheck = /[A-Z]/.test(password);
  const lowercaseCheck = /[a-z]/.test(password);
  const numberCheck = /[0-9]/.test(password);
  return lengthCheck && uppercaseCheck && lowercaseCheck && numberCheck;
}

// Función para mostrar/ocultar contraseña
function togglePassword(inputId, button) {
  const input = document.getElementById(inputId);
  if (input.type === "password") {
    input.type = "text";
    button.textContent = "🙈";
  } else {
    input.type = "password";
    button.textContent = "👁️";
  }
}

// Registro
async function register() {
  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;
  const type = document.getElementById("registerType").value;

  if (!name || !email || !password) {
    showError("Por favor, completa todos los campos.", "registerError");
    return;
  }

  if (!validatePassword(password)) {
    showError("La contraseña debe tener más de 6 caracteres, al menos una mayúscula, una minúscula y un número.", "registerError");
    return;
  }

  // Validar si el nombre de usuario ya está en uso
  try {
    const querySnapshot = await db.collection("users").where("name", "==", name).get();
    if (!querySnapshot.empty) {
      showError("El nombre de usuario ya está en uso. Por favor elige otro.", "registerError");
      return;
    }
  } catch (error) {
    showError("Error al verificar el nombre de usuario: " + error.message, "registerError");
    return;
  }

  // Si todo bien, crear usuario
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    await db.collection("users").doc(user.uid).set({
      name: name,
      type: type
    });

    alert("Registro exitoso. Ahora puedes iniciar sesión.");
    clearError("registerError");
    showLogin(); // Volver a login limpio después de registro
  } catch (error) {
    showError(error.message, "registerError");
  }
}

// Login
async function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    showError("Por favor, completa todos los campos.", "loginError");
    return;
  }

  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    const doc = await db.collection("users").doc(user.uid).get();
    const userData = doc.data();

    showSection("welcome");
    document.getElementById("welcomeText").innerText =
      `¡Bienvenido, ${userData.name}! Eres un ${userData.type}.`;

    clearError("loginError");
  } catch (error) {
    showError(error.message, "loginError");
  }
}

// Logout
function logout() {
  auth.signOut().then(() => {
    showLogin();
  });
}

// Función para mostrar sólo una sección y ocultar las demás con transición
function showSection(idToShow) {
  const sections = ["login", "register", "passwordReset", "welcome"];
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (id === idToShow) {
      el.classList.add("active");
    } else {
      el.classList.remove("active");
    }
  });
}

// Mostrar login y limpiar campos/errores
function showLogin() {
  showSection("login");

  document.getElementById("loginEmail").value = "";
  document.getElementById("loginPassword").value = "";
  clearError("loginError");
}

// Mostrar registro y limpiar campos/errores
function showRegister() {
  showSection("register");

  document.getElementById("registerName").value = "";
  document.getElementById("registerEmail").value = "";
  document.getElementById("registerPassword").value = "";
  document.getElementById("registerType").selectedIndex = 0;
  clearError("registerError");

  // Limpiar validación visual de contraseña
  updateCriteria("length", false);
  updateCriteria("uppercase", false);
  updateCriteria("lowercase", false);
  updateCriteria("number", false);
}

// Mostrar formulario de recuperación de contraseña
function showPasswordReset() {
  showSection("passwordReset");

  document.getElementById("resetEmail").value = "";
  clearError("resetError");
}

// Cancelar recuperación de contraseña (vuelve a login)
function cancelPasswordReset() {
  showLogin();
}

// Recuperar Contraseña
async function resetPassword() {
  const email = document.getElementById("resetEmail").value.trim();

  if (!email) {
    showError("Por favor ingresa tu correo electrónico.", "resetError");
    return;
  }

  try {
    await auth.sendPasswordResetEmail(email);
    alert("Correo de recuperación enviado.");
    clearError("resetError");
    cancelPasswordReset();
  } catch (error) {
    showError(error.message, "resetError");
  }
}

// Validación visual de requisitos en tiempo real para la contraseña del registro
document.getElementById("registerPassword").addEventListener("input", function () {
  const password = this.value;

  // Validaciones
  const isLengthValid = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  updateCriteria("length", isLengthValid);
  updateCriteria("uppercase", hasUppercase);
  updateCriteria("lowercase", hasLowercase);
  updateCriteria("number", hasNumber);
});

function updateCriteria(id, valid) {
  const el = document.getElementById(id);
  el.className = valid ? "valid" : "invalid";
  const descriptions = {
    length: "Mínimo 6 caracteres",
    uppercase: "Al menos una mayúscula",
    lowercase: "Al menos una minúscula",
    number: "Al menos un número"
  };
  el.textContent = (valid ? "✅ " : "❌ ") + descriptions[id];
}
