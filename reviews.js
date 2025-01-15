document.addEventListener("DOMContentLoaded", function () {
  const loginBtn = document.getElementById("login-btn");
  const loginForm = document.querySelector(".login-form");
  const registerForm = document.querySelector(".register-form");
  const reviewForm = document.querySelector(".review-form");
  document.querySelector(".login-success-message").classList.add("hidden");
  document.querySelector(".review-success-message").classList.add("hidden");
  document.querySelector(".register-success-message").classList.add("hidden");

  const localUser = localStorage.getItem("user");
  reviewForm.classList.add("hidden");
  async function loginUser(email, password) {
    const payload = JSON.stringify({ email, password });
    console.log(payload);
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
  }
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

  const sendReview = async (title, review, rating) => {
    const name = JSON.parse(localUser).name;
    const payload = JSON.stringify({ name, title, review, rating });
    console.log(payload);
    try {
      const response = await fetch("http://localhost:3000/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      });
      if (response.ok) {
        document
          .querySelector(".review-success-message")
          .classList.remove("hidden");
        document.getElementById("review-form-btn").classList.add("hidden");
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
    event.stopPropagation();
    event.preventDefault();

    const email = loginForm.querySelector("input[name='login-email']").value;
    const password = loginForm.querySelector(
      "input[name='login-password']"
    ).value;
    loginUser(email, password);
  });
  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();
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
  reviewForm.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const title = reviewForm.querySelector("input[name='review-title']").value;
    const review = reviewForm.querySelector(
      "textarea[name='review-review']"
    ).value;
    const rating = reviewForm.querySelector(
      "input[name='review-rating']"
    ).value;
    sendReview(title, review, rating);
  });
  document.addEventListener("click", function (event) {
    event.stopPropagation();
    if (event.target.classList.contains("btn-to-login")) {
      loginForm.classList.remove("hidden");
      registerForm.classList.add("hidden");
    }
    if (event.target.classList.contains("btn-to-register")) {
      registerForm.classList.remove("hidden");
      loginForm.classList.add("hidden");
    }
  });

  document.addEventListener("click", function (event) {
    if (event.target.id == "add-review-btn") {
      reviewForm.classList.remove("hidden");
    }
  });
  if (localUser != null) {
    document.querySelector(".account-section").classList.add("hidden");

    document.querySelector(".logged-in-as").textContent = `Logged in as: ${
      JSON.parse(localUser).name
    }`;
    fetch("http://localhost:3000/reviews")
      .then((res) => res.json())
      .then((data) => {
        const reviewsContainer = document.querySelector(".reviews-div");
        if (!reviewsContainer) {
          console.error("No element with class 'reviews-container' found.");
          return;
        }
        let sum = 0;
        data.forEach((review) => {
          sum += parseInt(review.rating);
          const reviewElement = document.createElement("div");
          reviewElement.classList.add("review");
          reviewElement.innerHTML = `
          <h3>${review.title}</h3>
          <p>Author: ${review.name}</p>
          <p>${review.review}</p>
          <p>Rating: ${review.rating}</p>
        `;

          reviewsContainer.appendChild(reviewElement);
        });
        const averageRating = Math.round((sum / data.length) * 10) / 10;
        document.querySelector(
          ".reviews-title"
        ).textContent += ` (Avg. ${averageRating})`;
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
      });
  } else {
    document.querySelector(".account-section").classList.remove("hidden");
    document.querySelector(".review-section").classList.add("hidden");
  }
  document.addEventListener("click", function (event) {
    if (event.target.id == "log-out-btn") {
      localStorage.clear();
      window.location.reload();
    }
  });
});
