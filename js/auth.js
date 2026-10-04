import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import { auth } from "./firebase.js";

const WORKER_URL = "https://ptw.ricardorodrigues0671.workers.dev";

const form = document.getElementById("authForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirmPassword");

const title = document.getElementById("formTitle");
const submitButton = document.getElementById("submitButton");
const switchButton = document.getElementById("switchButton");
const switchText = document.getElementById("switchText");
const message = document.getElementById("message");

let registerMode = true;

function showMessage(text, type = "") {
  message.textContent = text;
  message.className = `message ${type}`;
}

function setMode(register) {
  registerMode = register;

  nameInput.parentElement.style.display =
    register ? "block" : "none";

  confirmInput.parentElement.style.display =
    register ? "block" : "none";

  title.textContent =
    register ? "Criar conta" : "Entrar";

  submitButton.textContent =
    register ? "Criar minha conta" : "Entrar";

  switchText.textContent =
    register
      ? "Já possui uma conta?"
      : "Ainda não possui uma conta?";

  switchButton.textContent =
    register ? "Entrar" : "Criar conta";

  showMessage("");
}

switchButton.addEventListener("click", () => {
  setMode(!registerMode);
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const name = nameInput.value.trim();
  const confirmPassword = confirmInput.value;

  if (!email || !password) {
    showMessage("Preencha e-mail e senha.", "error");
    return;
  }

  if (registerMode) {

    if (!name) {
      showMessage("Digite seu nome.", "error");
      return;
    }

    if (password.length < 6) {
      showMessage("A senha precisa ter pelo menos 6 caracteres.", "error");
      return;
    }

    if (password !== confirmPassword) {
      showMessage("As senhas não são iguais.", "error");
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Criando conta...";

    try {

      const credential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = credential.user;

      const response = await fetch(
        `${WORKER_URL}/api/usuarios`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            uid: user.uid,
            nome: name,
            email: user.email
          })
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "Não foi possível criar o perfil."
        );
      }

      showMessage(
        "Conta criada com sucesso! Entrando...",
        "success"
      );

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);

    } catch (error) {

      let errorMessage = "Não foi possível criar a conta.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Este e-mail já está cadastrado.";
      }

      if (error.code === "auth/invalid-email") {
        errorMessage = "Digite um e-mail válido.";
      }

      if (error.code === "auth/weak-password") {
        errorMessage = "A senha é muito fraca.";
      }

      showMessage(errorMessage, "error");

    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Criar minha conta";
    }

  } else {

    submitButton.disabled = true;
    submitButton.textContent = "Entrando...";

    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      showMessage(
        "Login realizado! Entrando...",
        "success"
      );

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 700);

    } catch (error) {

      let errorMessage =
        "E-mail ou senha incorretos.";

      if (error.code === "auth/user-not-found") {
        errorMessage = "Usuário não encontrado.";
      }

      if (error.code === "auth/wrong-password") {
        errorMessage = "Senha incorreta.";
      }

      showMessage(errorMessage, "error");

    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Entrar";
    }
  }
});
