document.addEventListener("DOMContentLoaded", function () {
  const loginBtn = document.getElementById("login-btn");
  const loginForm = document.querySelector(".login-form");
  const registerForm = document.querySelector(".register-form");
  document.querySelector(".login-success-message").classList.add("hidden");
  document.querySelector(".register-success-message").classList.add("hidden");
  const localUser = localStorage.getItem("user");
  const loginUser = async (email, password) => {
    const payload = JSON.stringify({ email, password });

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      });
      if (response.ok) {
        console.log("Response is OK:", response.status);

        try {
          const user = await response.json();
          console.log("User data:", user);

          document
            .querySelector(".login-success-message")
            .classList.remove("hidden");
          document.getElementById("login-form-btn").classList.add("hidden");

          const localStorageData = JSON.stringify(user);
          console.log("Storing in localStorage:", localStorageData);
          localStorage.setItem("user", localStorageData);

          setTimeout(() => {
            console.log("Reloading the page...");
            window.location.reload();
          }, 2500);
        } catch (err) {
          console.error("Error parsing JSON response:", err);
        }
      } else {
        console.error("Response not OK:", response.status);
      }
    } catch (error) {}
  };
  const registerUser = async (name, email, password) => {
    const payload = JSON.stringify({ name, email, password });

    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      });
      if (response.ok) {
        document
          .querySelector(".register-success-message")
          .classList.remove("hidden");
        document.getElementById("register-form-btn").classList.add("hidden");
        localStorage.setItem("user", JSON.stringify(response.json()));
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      }
    } catch (error) {
      document.querySelector(".error-message").classList.remove("hidden");
    }
  };
  registerForm.classList.add("hidden");
  document
    .querySelectorAll(".success-message")
    .forEach((element) => element.classList.add("hidden"));

  document
    .querySelectorAll(".error-message")
    .forEach((element) => element.classList.add("hidden"));

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = loginForm.querySelector("input[name='login-email']").value;
    const password = loginForm.querySelector(
      "input[name='login-password']"
    ).value;
    loginUser(email, password);
  });
  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = registerForm.querySelector(
      "input[name='register-username']"
    ).value;
    const email = registerForm.querySelector(
      "input[name='register-email']"
    ).value;
    const password = registerForm.querySelector(
      "input[name='register-password']"
    ).value;
    registerUser(name, email, password);
  });
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("btn-to-login")) {
      loginForm.classList.remove("hidden");
      registerForm.classList.add("hidden");
    }
    if (event.target.classList.contains("btn-to-register")) {
      registerForm.classList.remove("hidden");
      loginForm.classList.add("hidden");
    }
  });

  if (localUser) {
    document.querySelector(".account-section").classList.add("hidden");
  } else {
    document.querySelector(".account-section").classList.remove("hidden");
    document.querySelector(".review-section").classList.add("hidden");
  }
});
